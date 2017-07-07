import { Sprite, SpriteManager, getPropertyDescriptor } from '../../../app';
import { Injector } from '../../../di';

export class Window extends Sprite {
  private graphics_bound: PIXI.Graphics;
  private _bound: PIXI.Rectangle;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this._bound = new PIXI.Rectangle;
    this.graphics_bound = new PIXI.Graphics;
  }

  public get bound(): PIXI.Rectangle { return new PIXI.Rectangle(this.x, this.y, this.width, this.height); }
  
  public setBound(_bound: PIXI.Rectangle) { 
    this._bound = _bound;
    this.update_bound();
  }

  public set x(x: number) {
    this._bound.x = x;
    this.update_bound();
  }
  public set y(y: number) {
    this._bound.y = y;
    this.update_bound();
  }
  
  public set width(width: number) {
    this._bound.width = width;
    this.update_bound();
  }
  
  public set height(height: number) {
    this._bound.height = height;
    this.update_bound();
  }

  protected baseSet(property: string, data: number) {
    getPropertyDescriptor(Object.getPrototypeOf(this.constructor.prototype), property).set.bind(this)(data);
  }
  
  protected baseGet(property: string): number{
    return getPropertyDescriptor(Object.getPrototypeOf(this.constructor.prototype), property).get.bind(this)();
  }

  public get x(): number { return this._bound.x; }
  public get y(): number { return this._bound.y;}
  public get width(): number { return this._bound.width; }
  public get height(): number { return this._bound.height; }

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
  
  public onInit() {
    super.onInit();
    this._container.addChild(this.graphics_bound);
    this.update_bound();
  }

  public onDestroy() {
    this._container.removeChild(this.graphics_bound);
    this.graphics_bound.destroy();
    super.onDestroy();
  }
}
