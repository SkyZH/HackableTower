import * as _ from 'lodash';
import { Subject, Observable, Subscriber } from 'rxjs';

import { Sprite } from '../../../app';
import { Injector } from '../../../di';
import { Tileset_Map } from '../tileset';
import { MapData, MapEvent, MAP_WALKABLE } from '../../../data';
import { App, SpriteManager } from '../../../app';
import { Charater_Event, Character, CHARACTER_STATUS } from '../character';
import { Map_getRoute } from './route';

export interface MapPosition {
  x: number;
  y: number;
};

export class Map extends Tileset_Map {

  private _map: MapData;
  private _renderTexture: PIXI.RenderTexture;
  private _sprite: PIXI.Sprite;
  private _events: Array<Charater_Event>;
  private m_spriteManager: SpriteManager;
  private _actor: Character;
  private _walkable: boolean[][];

  // TODO: Game Store
  private _actor_pos: MapPosition;

  protected app: App;

  private _mapClick$: Subject<MapPosition>;

  public get mapClick$(): Subject<MapPosition> { return this._mapClick$; }

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.app = this.injector.resolve(App);
    this._events = new Array<Charater_Event>();
    this.m_spriteManager = this.injector.init(SpriteManager)(this._container);
    this.injector.provide(SpriteManager, this.m_spriteManager);
    this._walkable = [];
  }

  public onInit() {
    super.onInit();
    this.m_spriteManager.onInit();
    this._sprite = new PIXI.Sprite();
    this._container.addChild(this._sprite);
    this.update_map();
    this.update_events();
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

  public set actorPos(pos: MapPosition) { this._actor_pos = pos; }
  public get actorPos() { return this._actor_pos; }

  public walkTo(pos: MapPosition, connection?: boolean[][]): Observable<any> {
    return new Observable(((subscriber: Subscriber<any>) => {
      this._actor.status = CHARACTER_STATUS.WALKING;
      let _route = Map_getRoute(this._actor_pos, pos, connection);
      console.log(_route);
      subscriber.complete();
    }));
  }

  public interact(pos: MapPosition): Observable<any> {
    return new Observable(((subscriber: Subscriber<any>) => {
      subscriber.complete();
    }));
  }

  private update_map() {
    console.log(this);
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

  private update_events() {
    _.forEach(this._map.events, (e: MapEvent) => {
      let _character = this.injector.init(Charater_Event)(e.data.character);
      this._events.push(_character);
      this.m_spriteManager.add(_character);
      _character.x = e.x * this.tileWidth;
      _character.y = e.y * this.tileHeight;
    });
    this.m_spriteManager.add(this._actor);
    this.update_actor();
  }

  private update_actor() {
    this._actor.x = this._actor_pos.x * this.tileWidth;
    this._actor.y = this._actor_pos.y * this.tileHeight;
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
