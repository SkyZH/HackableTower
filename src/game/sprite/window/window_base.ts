import { Sprite, SpriteManager, getPropertyDescriptor } from '../../../app';
import { Injector } from '../../../di';

export class Window extends Sprite {
  private graphics_bound: PIXI.Graphics;
  protected window_container: PIXI.Container;
  protected _bound: PIXI.Rectangle;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.graphics_bound = new PIXI.Graphics;
    this.window_container = new PIXI.Container;
    this._bound = new PIXI.Rectangle;
  }

  public get bound(): PIXI.Rectangle { return new PIXI.Rectangle(this.x, this.y, this.width, this.height); }

  public setBound(bound: PIXI.Rectangle) {
    this._bound = bound;
    this.update_window();
  }

  get x(): number { return this._bound.x; }
  get y(): number { return this._bound.y; }
  get width(): number { return this._bound.width; }
  get height(): number { return this._bound.height; }

  set x(x: number) { this._bound.x = x; this.update_window(); }
  set y(y: number) { this._bound.y = y; this.update_window(); }
  set width(width: number) { this._bound.width = width; this.update_window(); }
  set height(height: number) { this._bound.height = height; this.update_window(); }

  protected update_window() {
    this.window_container.x = this._bound.x;
    this.window_container.y = this._bound.y;
    this.update_bound();
  }

  private drawWindowBound() {
    this.graphics_bound.lineStyle(2, 0xffffff, 1);
    this.graphics_bound.beginFill(0x000000, 0.3);
    this.graphics_bound.drawRoundedRect(0, 0, this.width, this.height, 2);
    this.graphics_bound.endFill();
  }

  private update_bound() {
    this.graphics_bound.clear();
    this.drawWindowBound();
  }
  
  public onInit() {
    super.onInit();
    this._container.addChild(this.window_container);
    this.window_container.addChild(this.graphics_bound);
    this.update_bound();
  }

  public onDestroy() {
    this.window_container.removeChild(this.graphics_bound);
    this._container.removeChild(this.window_container);
    this.graphics_bound.destroy();
    super.onDestroy();
  }
}
