import { Scene, Sprite } from '../models';
import { Injector, Injectable } from '../../di';

import * as _ from 'lodash';

export class SpriteManager extends Injectable {
  private scene: Scene;
  private _container: PIXI.Container;

  private sprites: Sprite[];

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(SpriteManager, this);
    this.scene = this.injector.resolve(Scene);

    this.sprites = new Array<Sprite>();
  }

  private get container() {
    return this._container ? this._container : this.scene.stage;
  }

  public initialize(container?: PIXI.Container) {
    super.initialize();
    if (container) this._container = container;
  }

  public add(sprite: Sprite) {
    this.sprites.push(sprite);
    if (sprite.container) this.container.addChild(sprite.container);
    sprite.onInit();
  }

  public remove(sprite: Sprite) {
    _.remove(this.sprites, sprite);
    if (sprite.container) this.container.removeChild(sprite.container);
    sprite.onDestroy();
  }

  public onInit() {
  }

  public onDestroy() {
    _.forEach(this.sprites, (sprite: Sprite) => {
      if (sprite.container) this.container.removeChild(sprite.container);
      sprite.onDestroy();
    });
  }
};
