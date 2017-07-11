import { Injector } from '../../../di';
import { Sprite } from '../../models';
import { PlatformManager } from '../platform_manager';
import { App } from '../../app';

const LOADING_BAR_WIDTH: number = 200;
const LOADING_BAR_HEIGHT: number = 5;

export class Sprite_Loading extends Sprite {

  private _progress: number;
  private _text: PIXI.Text;
  private _graphics: PIXI.Graphics;
  
  protected platformManager: PlatformManager;
  protected app: App;

  constructor(baseInjector: Injector) {
    super(baseInjector, false);
    this.platformManager = this.injector.resolve(PlatformManager);
    this.app = this.injector.resolve(App);
  }

  onInit() {
    super.onInit();

    const style = new PIXI.TextStyle({
      fontFamily: "Noto Serif CJK SC Medium, Noto Serif, Roboto, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif",
      fill: '#cccccc',
      fontSize: 16
    });

    this._graphics = new PIXI.Graphics;
    this._text = new PIXI.Text('偷偷地加载资源', style);

    this._container.addChild(this._graphics);
    this._container.addChild(this._text);
    this._text.anchor.set(0.5);
    
    this.platformManager.resize$.subscribe(() => {
      this._text.x = this.app.renderer.screen.width / 2;
      this._text.y = this.app.renderer.screen.height / 2;
      this._graphics.x = (this.app.renderer.screen.width - LOADING_BAR_WIDTH) / 2
      this._graphics.y = this.app.renderer.screen.height / 2 + 20;
    });

    this.update_progress();
  }

  onDestroy() {
    super.onDestroy();
  }

  private update_progress() {
    this._graphics.clear();
    this._graphics.lineStyle(1, 0xffffff, 1);
    this._graphics.drawRoundedRect(0, 0, LOADING_BAR_WIDTH, LOADING_BAR_HEIGHT, 2);
    this._graphics.lineStyle(0, 0xffffff, 1);
    this._graphics.beginFill(0x03a9f4);
    this._graphics.drawRoundedRect(0, 0, LOADING_BAR_WIDTH * this._progress, LOADING_BAR_HEIGHT, 2);
    this._graphics.endFill();
  }

  public set progress(progress: number) {
    this._progress = progress;
    this.update_progress();
  }

  public get progress() { return this._progress; }
}
