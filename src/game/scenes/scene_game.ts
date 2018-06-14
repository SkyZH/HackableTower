import * as _ from 'lodash';
import { Observable, Subscriber } from 'rxjs';
import { Scene, SceneManager, ResourceManager, AudioManager, PRELOAD_RESOURCE, PRELOAD_DEPENDENCY } from '../../app';
import { Injector, Injectable } from '../../di';
import { Map, Character_Actor, CHARACTER_DIRECTION, CHARACTER_STATUS, Character_Animation, MapStatus, MapPosition } from '../sprite';
import { MAP_DATA, MapEvent } from '../../data';
import { MAP_RESOURCE } from '../resources';
import { GameStorage } from '../../store';
import { Interpreter, Interpreter_Action } from '../interpreter';
import { Window_Actor } from './window_actor';
import { Window_Command, Window } from '../sprite';
import { Command } from '../models';

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
  private _actorWindow: Window_Actor;
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
    this.init_map();
    this.addActorWindow();
    this.addMenuWindow();
    this._lock_walk = false;
    this.bindEvents();
  }

  private init_map() {
    this.goto_map(this.GAME_STORAGE.Actor.mapID, this.GAME_STORAGE.Actor.x, this.GAME_STORAGE.Actor.y, this.GAME_STORAGE.Actor.direction);
  }

  private get_map(mapID: string) {
    let map = _.cloneDeep(MAP_DATA[mapID]);
    _.forOwn(this.GAME_STORAGE.Event.event_disposed, (disposed, id) => {
      if (disposed && id.startsWith(mapID)) {
        delete map.events[id.match(/(.*)#(.*)/)[2]];
      }
    });
    return map;
  }
  private goto_map(mapID: string, x: number, y: number, direction: CHARACTER_DIRECTION) {
    if (this._map) this.spriteManager.remove(this._map);
    this._map = this.injector.init(Map)(this.get_map(mapID), this.injector.create(Character_Actor));
    this._map.actorStat = { x, y, direction };
    this.spriteManager.add(this._map);
    this._map.x = (this.viewport.width - this._map.width) / 2 + 200;
    this._map.y = (this.viewport.height - this._map.height) / 2;
    this.update_map();
    this._map.mapClick$.subscribe((pos) => this.process_map_click(pos));
  }

  private addActorWindow() {
    const actorWindow = this.injector.create(Window_Actor);
    this.spriteManager.add(actorWindow);
    this.resize$.subscribe(() => {
      actorWindow.x = (this.viewport.width - this._map.width) / 2 - actorWindow.width + 180;
      actorWindow.y = (this.viewport.height - this._map.height) / 2;
    });
  }

  private addMenuWindow() {
    const menuWindow = this.injector.create(Window_Command);
    this.spriteManager.add(menuWindow);
    menuWindow.commands = ([
      <Command> { name: '保存', cb: () => this.GAME_STORAGE.save() },
      <Command> { name: '退出', cb: () => this.sceneManager.pop() },
    ]);
    menuWindow.width = 200;
    this.resize$.subscribe(() => {
      menuWindow.x = (this.viewport.width - this._map.width) / 2 - 200 + 180;
      menuWindow.y = (this.viewport.height - this._map.height) / 2 + 310;
    });
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
                this.GAME_STORAGE.Event.event_disposed[`${this.GAME_STORAGE.Actor.mapID}#${_current.value.id}`] = true;
                this.update_map();
                __index++;
              } else if (actions[__index].teleport) {
                let options = actions[__index].teleport;
                this.GAME_STORAGE.Actor.mapID = options.mapID;
                this.GAME_STORAGE.Actor.x = options.x;
                this.GAME_STORAGE.Actor.y = options.y;
                this.goto_map(this.GAME_STORAGE.Actor.mapID, this.GAME_STORAGE.Actor.x, this.GAME_STORAGE.Actor.y, this.GAME_STORAGE.Actor.direction);
                subscriber.complete();
                return;
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

  private process_map_click(pos) {
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
  }
  public bindEvents() {
    this.stage.interactive = true;
    
    this.resize$.subscribe(() => {
      this._map.x = (this.viewport.width - this._map.width) / 2 + 200;
      this._map.y = (this.viewport.height - this._map.height) / 2;
    });
  }

  public onEnd() {
    super.onEnd();
    this.audioManager.stopBGM();
    this.audioManager.stopME();
    this.stage.interactive = false;
  }
}
