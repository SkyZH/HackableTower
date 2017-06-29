import { renderer } from '../app';

export class Scene {
  public stage: PIXI.Container;

  protected get viewport() : PIXI.Rectangle { return renderer.screen };
  
  constructor() {
    this.stage = new PIXI.Container();
  }
}
