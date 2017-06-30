import { Scene, Sprite } from '../models';
import * as _ from 'lodash';

export class SpriteManager {

  private sprites: Sprite[];

  constructor(public scene: Scene) {
    this.sprites = new Array<Sprite>();
  }

  public add(sprite: Sprite) {
    this.sprites.push(sprite);
    this.scene.stage.addChild(sprite._container);
    sprite.onInit(this);
  }

  public remove(sprite: Sprite) {
    _.remove(this.sprites, sprite);
    sprite.onDestroy();
    this.scene.stage.removeChild(sprite._container);
  }

  public onInit() {

  }

  public onDestroy() {
    _.forEach(this.sprites, (sprite: Sprite) => {
      sprite.onDestroy();
      this.scene.stage.removeChild(sprite._container);
    });
  }

  public get ticker(): PIXI.ticker.Ticker {
    return this.scene.ticker;
  }
};
