import { Sprite, SpriteManager, Scene } from '../../../app';
import { Window } from './window_base';
import { COS } from '../../util/animation/cos';
import { Injector } from '../../../di';

export class Window_Selectable extends Window {
  protected scene: Scene;

  private graphics_select: PIXI.Graphics;
  protected _select: PIXI.Rectangle;

  constructor(baseInjector: Injector) {
    super(baseInjector);

    this.scene = this.injector.resolve(Scene);

    this._select = new PIXI.Rectangle;
    this.graphics_select = new PIXI.Graphics;
  }
  
  private drawSelectableBound() {
    this.graphics_select.lineStyle(1, 0xffffff, 1);
    this.graphics_select.beginFill(0xffffff, 0.8);
    this.graphics_select.drawRoundedRect(
      this.x + this.selectBound.x,
      this.y + this.selectBound.y,
      this.selectBound.width, this.selectBound.height , 2
    );
    this.graphics_select.endFill();
  }

  private update_selectable() {
    this.graphics_select.clear();
    if (this._select) this.drawSelectableBound();
  }

  public get selectBound() { return this._select; }

  public setSelectBound(_bound: PIXI.Rectangle) { 
    this._select = _bound;
    this.update_selectable();
  }

  public set selectX(x: number) {
    this._select.x = x;
    this.update_selectable();
  }
  public set selectY(y: number) {
    this._select.y = y;
    this.update_selectable();
  }
  
  public set selectWidth(width: number) {
    this._select.width = width;
    this.update_selectable();
  }
  
  public set selectHeight(height: number) {
    this._select.height = height;
    this.update_selectable();
  }

  public get selectX(): number { return this._select.x; }
  public get selectY(): number { return this._select.y;}
  public get selectWidth(): number { return this._select.width; }
  public get selectHeight(): number { return this._select.height; }

  public onInit() {
    super.onInit();
    this._container.addChild(this.graphics_select);
    this.scene.ticker.add(t => {
      this.graphics_select.alpha =  COS(this.scene.ticker.lastTime, 2000, 0.5, 1);
    });
    this.update_selectable();
  }

  public onDestroy() {
    this._container.removeChild(this.graphics_select);
    this.graphics_select.destroy();
    super.onDestroy();
  }
}
