import * as _ from 'lodash';
import { Subject, Observable, Subscriber, timer } from 'rxjs';

import { Sprite, Scene } from '../../../app';
import { Injector } from '../../../di';
import { CHARACTER } from '../../const';
import { Tileset_Map } from '../tileset';
import { MapData, MapEvent, MAP_WALKABLE } from '../../../data';
import { App, SpriteManager } from '../../../app';
import { Charater_Event, Character, Character_Animation, CHARACTER_STATUS, CHARACTER_DIRECTION } from '../character';
import { Map_GetRoute } from './route';
import { LINEAR } from '../../util/animation/linear';

export interface MapPosition {
  x: number;
  y: number;
};

export interface MapStatus {
  x: number;
  y: number;
  direction: CHARACTER_DIRECTION;
};

export class Map extends Tileset_Map {

  private _map: MapData;
  private _renderTexture: PIXI.RenderTexture;
  private _sprite: PIXI.Sprite;
  private _events_sprite: { [id: string]: Charater_Event };
  private m_spriteManager: SpriteManager;
  private _actor: Character;
  private _walkable: boolean[][];

  private _actor_status: MapStatus;

  protected app: App;
  protected scene: Scene;

  private _mapClick$: Subject<MapPosition>;

  public get mapClick$(): Subject<MapPosition> { return this._mapClick$; }

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.app = this.injector.resolve(App);
    this.scene = this.injector.resolve(Scene);
    this._events_sprite = {};
    this.m_spriteManager = this.injector.init(SpriteManager)(this._container);
    this.injector.provide(SpriteManager, this.m_spriteManager);
    this._walkable = [];
  }

  public onInit() {
    super.onInit();
    this.m_spriteManager.onInit();
    this._sprite = new PIXI.Sprite();
    this._container.addChild(this._sprite);
    this.init_map();
    this.init_actor();
    this.update_events();
    this.update_actor();
    this._container.interactive = true;
    this.bind_events();
  }

  private bind_events() {
    this._mapClick$ = new Subject<MapPosition>();
    this._container.on('pointerdown', (e: PIXI.interaction.InteractionEvent) => {
      let _pos = e.data.getLocalPosition(this._container, e.data.global);
      this._mapClick$.next(<MapPosition> {x: Math.floor(_pos.x / 32), y: Math.floor(_pos.y / 32) });
    });
  }

  public set actorStat(pos: MapStatus) { this._actor_status = pos; }
  public get actorStat(): MapStatus { return this._actor_status; }

  private __get_interactable(pos: MapPosition, target: MapPosition): CHARACTER_DIRECTION {
    const _D = [
      [CHARACTER_DIRECTION.__INVALID, CHARACTER_DIRECTION.UP, CHARACTER_DIRECTION.__INVALID],
      [CHARACTER_DIRECTION.LEFT, CHARACTER_DIRECTION.__NONE, CHARACTER_DIRECTION.RIGHT],
      [CHARACTER_DIRECTION.__INVALID, CHARACTER_DIRECTION.DOWN, CHARACTER_DIRECTION.__INVALID]
    ];
    if (Math.abs(pos.x - target.x) + Math.abs(pos.y - target.y) <= 1) {
      let _deltaX = target.x - pos.x;
      let _deltaY = target.y - pos.y;
      return _D[_deltaY + 1][_deltaX + 1];
    } else return CHARACTER_DIRECTION.__INVALID;
  }

  public walkTo(pos: MapPosition, connection?: boolean[][]): Observable<any> {
    return new Observable(((subscriber: Subscriber<any>) => {
      this._actor.status = CHARACTER_STATUS.WALKING;
      let _route = Map_GetRoute(this._actor_status, pos, connection);
      _route.shift();
      let _current = 0;
      const __walkTo = (current: MapPosition, target: MapStatus) => {
        return new Observable((sub: Subscriber<any>) => {
          const __animationStart = this.scene.ticker.lastTime;
          const fn = () => {
            let __animationTime = this.scene.ticker.lastTime - __animationStart;
            if (__animationTime > CHARACTER.CHARACTER_SPRITE_SPEED_WALK) {
              this._actor.x = target.x * this.tileWidth;
              this._actor.y = target.y * this.tileHeight;
              this.scene.ticker.remove(fn);
              sub.next();
              sub.complete();
            } else {
              this._actor.x = LINEAR(__animationTime, CHARACTER.CHARACTER_SPRITE_SPEED_WALK, current.x, target.x) * this.tileWidth;
              this._actor.y = LINEAR(__animationTime, CHARACTER.CHARACTER_SPRITE_SPEED_WALK, current.y, target.y) * this.tileHeight;
            }
          };
          this.scene.ticker.add(fn);
        });
      }
      const __doWalk = (cID: number) => {
        if (cID >= _route.length) {
          this._actor.status = CHARACTER_STATUS.STOP;
          subscriber.next();
          subscriber.complete();
        } else {
          this._actor.direction = <CHARACTER_DIRECTION>_route[cID].direction;
          __walkTo(this._actor_status, _route[cID]).subscribe(() => {
            this._actor_status = _route[cID];
            __doWalk(cID + 1);
          });
        }
      }
      __doWalk(0);
    }));
  }

  public face(pos: MapPosition) {
    let _direction = this.__get_interactable(this._actor_status, pos);
    if (_direction != CHARACTER_DIRECTION.__INVALID) {
      if (_direction != CHARACTER_DIRECTION.__NONE) {
        this._actor_status.direction = _direction;
        this.update_actor();
      }
    }
  }

  public animate_event(event_id: string, animation: Character_Animation[]): Observable<any> {
    return new Observable((sub: Subscriber<any>) => {
      let __index = 0;
      let character = this._events_sprite[event_id];
      const process_event = () => {
        while (__index < animation.length) {
          if (animation[__index].direction) {
            character.direction = animation[__index].direction;
            __index++;
          }
          else if (animation[__index].status) {
            character.status = animation[__index].status;
            __index++;
          }
          else if (animation[__index].pause) {
            timer(animation[__index].pause).subscribe(() => process_event());
            __index++;
            return;
          } else {
            __index++;
          }
        }
        sub.next();
        sub.complete();
        return;
      }
      process_event();
    });
  }

  private init_map() {
    let __map_sprites = [];
    let __container = new PIXI.Container;
    this._renderTexture = PIXI.RenderTexture.create(this.width, this.height);
    this._sprite.texture = this._renderTexture;
    for (let i = 0; i < this._map.row; i++) {
      for (let j = 0; j < this._map.col; j++) {
        const k = i * this._map.col + j;
        let _sprite = new PIXI.Sprite(this.getTileID(this._map.data[k]));
        _sprite.x = j * this.tileWidth;
        _sprite.y = i * this.tileHeight;
        __map_sprites.push(_sprite);
        __container.addChild(_sprite);
      }
    }
    this.app.renderer.render(__container, this._renderTexture);
    _.forEach(__map_sprites, s => {
      s.destroy();
    });
    __container.destroy();
  }

  private init_actor() {
    this.m_spriteManager.add(this._actor);
  }

  public update_events() {
    _.forOwn(this._events_sprite, (v, id) => {
      if (!(id in this._map.events)) {
        this.m_spriteManager.remove(this._events_sprite[id]);
        delete this._events_sprite[id];
      }
    })
    _.forOwn(this._map.events, (e: MapEvent, id: string) => {
      if (!this._events_sprite[id]) {
        let _character = this.injector.init(Charater_Event)(e.data.character);
        this._events_sprite[id] = _character;
        _character.container.interactive = true;
        _character.container.buttonMode = true;
        this.m_spriteManager.add(_character);
        if (e.options.character_direction) _character.direction = e.options.character_direction;
        if (e.data.tileID) _character.frame = e.data.tileID;
        _character.x = e.x * this.tileWidth;
        _character.y = e.y * this.tileHeight;
      }
    });
  }

  private update_actor() {
    [this._actor.x, this._actor.y] = [this._actor_status.x * this.tileWidth, this._actor_status.y * this.tileHeight];
    this._actor.direction = this._actor_status.direction;
  }

  public initialize(map_data: MapData, actor: Character) {
    super.initialize();
    this._map = map_data;
    this._actor = actor;
    this._walkable = _.map(_.range(map_data.col), () => _.times(map_data.row, _.stubFalse));
    for (let y = 0; y < map_data.row; y++) {
      for (let x = 0; x < map_data.col; x++) {
        this._walkable[x][y] = MAP_WALKABLE[map_data.data[y * map_data.col + x]];
      }
    }
  }

  public get map(): MapData { return this._map; }
  public get walkable(): boolean[][] { return _.clone(this._walkable); }

  public get width(): number { return this._map.col * this.tileWidth; }
  public get height(): number { return this._map.row * this.tileHeight; }
  public get row(): number { return this._map.row; }
  public get col(): number { return this._map.col; }
  public get x(): number { return this._container.x; }
  public get y(): number { return this._container.y;}
  public set x(x: number) { this._container.x = x;}
  public set y(y: number) { this._container.y = y; }

  public onDestroy() {
    this._container.interactive = false;
    this._mapClick$ = null;
    this._container.removeChild(this._sprite);
    this._sprite.destroy();
    this._renderTexture.destroy();
    this.m_spriteManager.onDestroy();
    super.onDestroy();
  }
}
