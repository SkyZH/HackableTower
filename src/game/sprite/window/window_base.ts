import { Sprite, SpriteManager } from '../../../app';

export class Window extends Sprite {
  private graphics_bound: PIXI.Graphics;

  constructor(protected _bound: PIXI.Rectangle) {
    super();
    this.graphics_bound = new PIXI.Graphics;
    this.container.addChild(this.graphics_bound);
  }

  public get bound(): PIXI.Rectangle { return new PIXI.Rectangle(this.x, this.y, this.width, this.height); }
  
  public setBound(_bound: PIXI.Rectangle) { 
    this._bound = _bound;
    this.update();
  }

  public set x(x: number) {
    this._bound.x = x;
    this.update();
  }
  public set y(y: number) {
    this._bound.y = y;
    this.update();
  }
  
  public set width(width: number) {
    this._bound.width = width;
    this.update();
  }
  
  public set height(height: number) {
    this._bound.height = height;
    this.update();
  }

  public get x() { return this._bound.x; }
  public get y() { return this._bound.y; }
  public get width() { return this._bound.width; }
  public get height() { return this._bound.height; }

  private drawWindowBound() {
    this.graphics_bound.lineStyle(2, 0xffffff, 1);
    this.graphics_bound.beginFill(0x000000, 0.3);
    this.graphics_bound.drawRoundedRect(this.x, this.y, this.width, this.height, 2);
    this.graphics_bound.endFill();
  }

  private update_bound() {
    this.graphics_bound.clear();
    this.drawWindowBound();
  }

  public update() {
    super.update();
    this.update_bound();
  }

  public onInit(spriteManager: SpriteManager) {
    super.onInit(spriteManager);
    this.update();
  }
}