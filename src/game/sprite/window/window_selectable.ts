import { Sprite, SpriteManager } from '../../../app';
import { Window } from './window_base';
import { COS } from '../../util/animation/cos';

export class Window_Selectable extends Window {
  private graphics_select: PIXI.Graphics;
  protected _select: PIXI.Rectangle;

  constructor(_bound: PIXI.Rectangle) {
    super(_bound);
    this.graphics_select = new PIXI.Graphics;
    this.container.addChild(this.graphics_select);
    this._select = new PIXI.Rectangle(0, 0, 0, 0);
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
    this.drawSelectableBound();
  }

  public update() {
    super.update();
    this.update_selectable();
  }
  
  public get selectBound() { return this._select; }

  public set selectBound(_bound: PIXI.Rectangle) { 
    this._select = _bound;
    this.update_selectable();
  }

  public onInit(spriteManager: SpriteManager) {
    super.onInit(spriteManager);
    this.spriteManager.ticker.add(t => {
      this.graphics_select.alpha =  COS(this.spriteManager.ticker.lastTime, 2000, 0.5, 1);
    })
  }
}
