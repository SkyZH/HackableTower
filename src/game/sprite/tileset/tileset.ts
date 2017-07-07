import * as _ from 'lodash';
import { Sprite, ResourceManager } from '../../../app';
import { Injector } from '../../../di';

export abstract class Tileset extends Sprite {
  private _tileset: PIXI.Texture;
  private _textures: { [id: number]: PIXI.Texture; };
  private _row: number;
  private _col: number;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this._textures = {};
  }

  protected setTileset(name: string) {
    this._tileset = this.injector.resolve(ResourceManager).Tileset(name).texture;
  }

  protected setCharacter(name: string) {
    this._tileset = this.injector.resolve(ResourceManager).Character(name).texture;
    this.setRow(4);
    this.setCol(4);
  }

  protected setRow(row: number) { this._row = row; }
  protected setCol(col: number) { this._col = col; }

  public get row() { return this._row; }
  public get col() { return this._col; }
  public get width() { return this._tileset.width / this._col; }
  public get height() { return this._tileset.height / this._row; }

  private bound(x: number, y: number, x_split: number, y_split: number, w: number, h: number) {
    return new PIXI.Rectangle(
      (w / x_split) * x,
      (h / y_split) * y,
      w / x_split,
      h / y_split
    );
  }

  private _getTile(row: number, col: number): PIXI.Texture {
    return new PIXI.Texture(this._tileset.baseTexture, this.bound(col, row, this._col, this._row, this._tileset.width, this._tileset.height));
  }
  
  private _ensureID(id: number) {
    if (id < 0 || id >= this._col * this._row) throw new Error('accessing invaild id in tileset');
  }

  public getTile(row: number, col: number): PIXI.Texture {
    let _id = row * this._col + col;
    this._ensureID(_id);
    if (!this._textures[_id]) this._textures[_id] = this._getTile(row, col);
    return this._textures[_id];
  }

  public getTileID(id: number): PIXI.Texture {
    this._ensureID(id);
    if (!this._textures[id]) this._textures[id] = this._getTile(Math.floor(id / this.col), id % this.col);
    return this._textures[id];
  }

  protected getAllTiles(): Array<PIXI.Texture> {
    let __textures = [];
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        __textures.push(this.getTile(i, j));
      }
    }
    return __textures;
  }

  public onDestroy() {
    _.forOwn(this._textures, (texture: PIXI.Texture) => {
      texture.destroy();
    });
  }
}
