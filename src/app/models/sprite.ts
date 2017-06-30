import { SpriteManager } from '../managers';

export class Sprite {
  protected spriteManager: SpriteManager;
  protected container: PIXI.Container;

  public get _container() {
    return this.container;
  }

  constructor() {
    this.container = new PIXI.Container();
  }

  public onInit(spriteManager: SpriteManager) {
    this.spriteManager = spriteManager;
    this.update();
  }

  public onDestroy() {
    this.container.destroy(true);
  }

  public update() {
    
  }
}
