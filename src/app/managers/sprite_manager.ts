import { Scene, Sprite } from '../models';
import { Injector, Injectable } from '../../di';

import * as _ from 'lodash';

export class SpriteManager extends Injectable {
  private scene: Scene;

  private sprites: Sprite[];

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(SpriteManager, this);
    this.scene = this.injector.resolve(Scene);

    this.sprites = new Array<Sprite>();
  }

  public add(sprite: Sprite) {
    this.sprites.push(sprite);
    this.scene.stage.addChild(sprite.container);
    sprite.onInit();
  }

  public remove(sprite: Sprite) {
    _.remove(this.sprites, sprite);
    this.scene.stage.removeChild(sprite.container);
    sprite.onDestroy();
  }

  public onInit() {
  }

  public onDestroy() {
    _.forEach(this.sprites, (sprite: Sprite) => {
      this.scene.stage.removeChild(sprite.container);
      sprite.onDestroy();
    });
  }
};
