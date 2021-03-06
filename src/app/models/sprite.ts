import { SpriteManager } from '../managers';
import { Injector, Injectable } from '../../di';

export class Sprite extends Injectable {
  protected spriteManager: SpriteManager;
  protected _container: PIXI.Container;

  get container() { return this._container; }

  constructor(baseInjector: Injector, resolveManager?: boolean) {
    super(baseInjector);
    if (resolveManager == null || resolveManager == true) this.spriteManager = this.injector.resolve(SpriteManager);
    this._container = new PIXI.Container();
  }

  public onInit() {
  }
  
  public onDestroy() {
    this._container.destroy();
  }
}
