import { Subject } from 'rxjs';
import { SubscriptionManaged } from '../util';
import { SpriteManager, SceneManager, PlatformManager } from '../managers';
import { App } from '../app';
import { Injector, Injectable } from '../../di';

export class Scene extends SubscriptionManaged {
  protected app: App;
  protected platformManager: PlatformManager;
  protected spriteManager: SpriteManager;

  public stage: PIXI.Container;
  public ticker: PIXI.ticker.Ticker;
  public resize$: Subject<any>;
  private _graphics: PIXI.Graphics;

  public get viewport() : PIXI.Rectangle { return this.app.renderer.screen };
  
  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(Scene, this);

    this.app = this.injector.resolve(App);
    this.platformManager = this.injector.resolve(PlatformManager);
    this.spriteManager = this.injector.selfProvide(SpriteManager);

    this.stage = new PIXI.Container();
    this.resize$ = new Subject<any>();
    this._graphics = new PIXI.Graphics();
  }

  onInit() {
    this.ticker = new PIXI.ticker.Ticker();
    this.stage.addChild(this._graphics);
    this.spriteManager.onInit();
  }

  onStart() {
    this.ticker.start();
    this.sub(this.platformManager.resize$.subscribe(d => {
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
    this._graphics.destroy();
    this.stage.destroy();
  }
}
