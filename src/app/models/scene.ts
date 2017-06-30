import { Subject } from 'rxjs';
import { resize$ as Resize$, SubscriptionManaged } from '../util';
import { renderer } from '../app';
import { SpriteManager } from '../managers';

export class Scene extends SubscriptionManaged {
  public stage: PIXI.Container;
  public ticker: PIXI.ticker.Ticker;
  public resize$: Subject<any>;
  protected spriteManager: SpriteManager;
  private _graphics: PIXI.Graphics;

  public get viewport() : PIXI.Rectangle { return renderer.screen };
  
  constructor() {
    super();
    this.stage = new PIXI.Container();
    this.resize$ = new Subject<any>();
    this._graphics = new PIXI.Graphics();
    this.spriteManager = new SpriteManager(this);
  }

  onInit() {
    this.ticker = new PIXI.ticker.Ticker();
    this.spriteManager.onInit();
    this.stage.addChild(this._graphics);
  }

  onStart() {
    this.ticker.start();
    this.sub(Resize$.subscribe(d => {
      this.resize$.next();
    }));
    this.resize$.subscribe(() => {
      this._graphics.clear();
      this._graphics.lineStyle(0);
      this._graphics.beginFill(0x000000, 1);
      this._graphics.drawRect(0, 0, this.viewport.width, this.viewport.height);
      this._graphics.endFill();
    })
    this.resize$.next();
  }

  onEnd() {
    this.unsub();
    this.ticker.stop();
  }

  onDestroy() {
    this.ticker.destroy();
    this.spriteManager.onDestroy();
    this.stage.destroy(true);
  }
}
