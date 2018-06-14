import { Window } from '../sprite';
import { Injector } from '../../di';
import { GameStorage } from '../../store';
import { SubscriptionManaged } from '../../app';
import { MAP_DATA, MapEvent } from '../../data';

export class Window_Actor extends Window {
  protected GAME_STORAGE: GameStorage;
  private _context: SubscriptionManaged;
  private _text: PIXI.Text;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.GAME_STORAGE = this.injector.resolve(GameStorage);
    this._context = this.injector.create(SubscriptionManaged);
  }

  private update_text() {
    this._text.text = 
`Status
迟先生
Lv.1
橙色钥匙 ${this.GAME_STORAGE.Item.key_orange}
红色钥匙 ${this.GAME_STORAGE.Item.key_red}
蓝色钥匙 ${this.GAME_STORAGE.Item.key_blue}
${MAP_DATA[this.GAME_STORAGE.Actor.mapID].name}
`;
  }

  public onInit() {
    super.onInit();
    const style = new PIXI.TextStyle({
      fontFamily: 'Noto Serif CJK SC Medium, Noto Serif, Roboto, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif',
      fill: '#ffffff',
      fontSize: 16
    });
    this._text = new PIXI.Text('', style);
    this._context.sub(this.GAME_STORAGE.Item.listen('key_orange').subscribe(() => this.update_text()));
    this._context.sub(this.GAME_STORAGE.Item.listen('key_blue').subscribe(() => this.update_text()));
    this._context.sub(this.GAME_STORAGE.Item.listen('key_red').subscribe(() => this.update_text()));
    this._context.sub(this.GAME_STORAGE.Actor.listen('mapID').subscribe(() => this.update_text()));
    this.window_container.addChild(this._text);
    this._text.x = 10;
    this._text.y = 10;
    this.update_text();
  }

  public onDestroy() {
    this._context.unsub();
    super.onDestroy();
  }

  public set width(width: number) { throw new Error('actor window width not settable'); }
  public set height(height: number) { throw new Error('actor window height not settable'); }
  public get width() { return 200; }
  public get height() { return 300; }
}
