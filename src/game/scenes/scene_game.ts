import * as _ from 'lodash';
import { Observable, Subscriber } from 'rxjs';
import { Scene, SceneManager, ResourceManager, AudioManager, PRELOAD_RESOURCE, PRELOAD_DEPENDENCY } from '../../app';
import { Injector, Injectable } from '../../di';
import { Map, Character_Actor, CHARACTER_DIRECTION, CHARACTER_STATUS, Character_Animation, MapStatus, MapPosition } from '../sprite';
import { MAP_DATA, MapEvent } from '../../data';
import { MAP_RESOURCE } from '../resources';
import { GameStorage } from '../../store';
import { Interpreter, Interpreter_Action } from '../interpreter';

@PRELOAD_RESOURCE({
  sound: ['POL-perfect-engineering-short.wav', 'walking.wav']
})
@PRELOAD_DEPENDENCY([Map, Character_Actor, MAP_RESOURCE])
export class Scene_Game extends Scene {
  protected resourceManager: ResourceManager;
  protected sceneManager: SceneManager;
  protected audioManager: AudioManager;
  protected GAME_STORAGE: GameStorage;
  protected INTERPRETER: Interpreter;

  private _map: Map;
  private _actor: Character_Actor;

  private _lock_walk: boolean;
  
  constructor(baseInjector: Injector) {
    super(baseInjector);
    
    this.resourceManager = this.injector.resolve(ResourceManager);
    this.sceneManager = this.injector.resolve(SceneManager);
    this.audioManager = this.injector.resolve(AudioManager);
    this.GAME_STORAGE = this.injector.resolve(GameStorage);
    this.INTERPRETER = this.injector.selfProvide(Interpreter);
  }

  public onInit() {
    super.onInit();
    this.audioManager.playBGM(this.resourceManager.Sound('POL-perfect-engineering-short.wav'));
    this.addMap();
    this._lock_walk = false;
    this.bindEvents();
  }

  public addMap() {
    this._map = this.injector.init(Map)(_.clone(MAP_DATA.MAP_0), this.injector.create(Character_Actor));
    this._map.actorStat = { x: this.GAME_STORAGE.Actor.x, y: this.GAME_STORAGE.Actor.y, direction: this.GAME_STORAGE.Actor.direction };
    this.spriteManager.add(this._map);
  }

  private _connection: boolean[][];

  public update_map() {
    this._map.update_events();
    this.update_connection();
  }

  public update_connection() {
    this._connection = _.cloneDeep(this._map.walkable);
    _.forEach(this._map.map.events, e => {
      this._connection[e.x][e.y] = false;
    });
  }

  private __interact(pos: MapPosition): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      let __events = this._map.map.events;
      let iter = (function* () {
        yield* _.chain(__events)
          .pickBy((e: MapEvent) => e.x == pos.x && e.y == pos.y)
          .map((e: MapEvent, id: string) => ({ id, e }))
          .value();
      })();
      const do_next = () => {
        let _current = iter.next();
        if (_current.done) {
          subscriber.complete();
          return;
        }
        this.INTERPRETER.interpret(_current.value.e).subscribe((actions: Interpreter_Action[]) => {
          let __index = 0;
          const __interpret = () => {
            while (__index < actions.length) {
              if (actions[__index].se) {
                this.audioManager.playSE(this.resourceManager.Sound(actions[__index].se));
                __index++;
              }
              else if (actions[__index].animate) {
                this._map.animate_event(_current.value.id, actions[__index].animate).subscribe(() => __interpret());
                __index++;
                return;
              } else if (actions[__index].dispose) {
                delete __events[_current.value.id];
                this.update_map();
                __index++;
              } else {
                __index++;
              }
            }
          };
          __interpret();
        }, null, () => {
          subscriber.next(_current.value.id);
          do_next();
        });
      };
      do_next();
    })
  }

  public bindEvents() {
    this.stage.interactive = true;
    this.update_connection();
    this._map.mapClick$.subscribe((pos) => {
      if (!this._lock_walk) this._lock_walk = true; else return;
      this.audioManager.playME(this.resourceManager.Sound('walking.wav'));
      this._map.walkTo(pos, this._connection).subscribe(() => {
        this._lock_walk = false;
        this.audioManager.stopME();
        let _status = this._map.actorStat;
        [this.GAME_STORAGE.Actor.x, this.GAME_STORAGE.Actor.y, this.GAME_STORAGE.Actor.direction] = [_status.x, _status.y, _status.direction];
        
        if (Math.abs(_status.x - pos.x) + Math.abs(_status.y - pos.y) <= 1) {
          this._lock_walk = true;
          this._map.face(pos);
          this.__interact(pos).subscribe((id: string) => {}, () => null, () => this._lock_walk = false);
        }
      });
    });
    
    this.resize$.subscribe(() => {
      this._map.x = (this.viewport.width - this._map.width) / 2 + 200;
      this._map.y = (this.viewport.height - this._map.height) / 2;
    });
  }

  public onEnd() {
    super.onEnd();
    this.audioManager.stopBGM();
    this.stage.interactive = false;
  }
}
