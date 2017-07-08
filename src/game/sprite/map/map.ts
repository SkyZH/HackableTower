import * as _ from 'lodash';

import { Sprite } from '../../../app';
import { Injector } from '../../../di';
import { Tileset_Map } from '../tileset';
import { MapData } from '../../../data';
import { App } from '../../../app';

export class Map extends Tileset_Map {

  private _map: MapData;
  private _renderTexture: PIXI.RenderTexture;
  private _sprite: PIXI.Sprite;

  protected app: App;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.app = this.injector.resolve(App);
  }

  public onInit() {
    super.onInit();
    this._sprite = new PIXI.Sprite();
    this._container.addChild(this._sprite);
  }

  private update_map() {
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

  public set map(map: MapData) {
    this._map = map;
    this.update_map();
  }

  public get map(): MapData { return this._map; }

  public get width(): number { return this._map.col * this.tileWidth; }
  public get height(): number { return this._map.row * this.tileHeight; }
  public get row(): number { return this._map.row; }
  public get col(): number { return this._map.col; }
  public get x(): number { return this._sprite.x; }
  public get y(): number { return this._sprite.y;}
  public set x(x: number) { this._sprite.x = x;}
  public set y(y: number) { this._sprite.y = y; }

  public onDestroy() {
    this._container.removeChild(this._sprite);
    this._sprite.destroy();
    this._renderTexture.destroy();
    super.onDestroy();
  }
}
