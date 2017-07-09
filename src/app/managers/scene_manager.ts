import * as _ from 'lodash';
import { Observable, Subscriber } from 'rxjs';
import { Scene } from '../models';
import { App } from '../app';
import { ResourceManager } from './resource_manager';
import { Injector, Injectable } from '../../di';

export class SceneManager extends Injectable {
  private app: App;
  private resourceManager: ResourceManager;
  private _scenes: Array<{ new(...args : any[]): Scene }>;
  private _current: Scene;
  private ticker: PIXI.ticker.Ticker;

  private _loadingText: PIXI.Text;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(SceneManager, this);
    this.app = this.injector.resolve(App);
    this.resourceManager = this.injector.resolve(ResourceManager);

    this._scenes = new Array<{ new(): Scene }>();
    this.ticker = new PIXI.ticker.Ticker;
    this.ticker.start();

    this._loadingText = this.getLoadingText();
  }

  private getLoadingText() {
    const style = new PIXI.TextStyle({
      fontFamily: "Noto Serif CJK SC Medium, Noto Serif, Roboto, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif",
      fill: '#cccccc',
      fontSize: 16
    });

    const richText = new PIXI.Text('加载中...', style);

    richText.x = 10;
    richText.y = 10;

    return richText;
  }

  private endScene(scene: Scene): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      let __cnt = 0;
      const tick = () => {
        __cnt++;
        if (__cnt >= 60) {
          scene.stage.alpha = 0;
          this.ticker.remove(tick);
          scene.onDestroy();
          subscriber.next();
          subscriber.complete();
        } else scene.stage.alpha = 1 - __cnt / 60;
      };
      this.ticker.add(tick);
      scene.onEnd();
    });
  }

  private startScene(scene: Scene): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.app.stage.addChild(this._loadingText);
      let total = this.resourceManager.queueSize;
      this.resourceManager.preload().subscribe(progress => {
        this._loadingText.text = `加载中 (${progress}/${total})`;
      }, null, () => {
        this.app.stage.removeChild(this._loadingText);
        scene.onInit();
        scene.onStart();
        subscriber.next();
        subscriber.complete();
      });
    });
  }
  
  public push <T extends Scene> (scene: { new(...args : any[]): T }) {
    const tick = () => {
      this._scenes.push(scene);
      this._current = this.injector.create(scene);
      this.refresh();
      this.startScene(this._current).subscribe();
    };
    if (this._current) this.endScene(this._current).subscribe(() => tick()); else tick();
  }

  public pop() {
    if (_.isEmpty(this._scenes)) {
      throw new Error('scene stack already empty');
    } else {
      this.endScene(this._current).subscribe(() => {
        this._scenes.pop();

        if (!_.isEmpty(this._scenes)) {
          this._current = <Scene> this.injector.create(_.last(this._scenes));
          this.refresh();
          this.startScene(this._current);
        } else {
          this.refresh();
          this._current = null;
        }
      });
    }
  }

  public goto <T extends Scene> (scene: { new(...args : any[]): T }) {
    const tick = () => {
      this._scenes = [scene];
      this._current = this.injector.create(scene);
      this.refresh();
      this.startScene(this._current);
    };
    if (this._current) this.endScene(this._current).subscribe(() => tick()); else tick();
  }

  private refresh() {
    this.app.stage.removeChildren();
    if (this._current) this.app.stage.addChild(this._current.stage)
  }
};
