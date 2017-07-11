import * as _ from 'lodash';
import { Observable, Subscriber } from 'rxjs';
import { Scene } from '../models';
import { App } from '../app';
import { ResourceManager } from './resource_manager';
import { Injector, Injectable } from '../../di';
import { Sprite_Loading } from './scene_manager/sprite_loading';

export class SceneManager extends Injectable {
  protected app: App;
  protected resourceManager: ResourceManager;
  private _scenes: Array<{ new(...args : any[]): Scene }>;
  private _current: Scene;
  private ticker: PIXI.ticker.Ticker;

  private _loadingSprite: Sprite_Loading;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(SceneManager, this);
    this.app = this.injector.resolve(App);
    this.resourceManager = this.injector.resolve(ResourceManager);

    this._scenes = new Array<{ new(): Scene }>();
    this.ticker = new PIXI.ticker.Ticker;
    this.ticker.start();

    this._loadingSprite = this.injector.create(Sprite_Loading);
    this._loadingSprite.onInit();
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
      this.app.stage.addChild(this._loadingSprite.container);
      let total = this.resourceManager.queueSize;
      this._loadingSprite.progress = 0;
      this.resourceManager.preload().subscribe(progress => {
        this._loadingSprite.progress = progress / total;
      }, null, () => {
        this.app.stage.removeChild(this._loadingSprite.container);
        scene.stage.alpha = 0;
        scene.onInit();
        scene.onStart();
        let __cnt = 0;
        const tick = () => {
          __cnt++;
          if (__cnt >= 20) {
            scene.stage.alpha = 1;
            this.ticker.remove(tick);
            subscriber.next();
            subscriber.complete();
          } else scene.stage.alpha = __cnt / 20;
        };
        this.ticker.add(tick);
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
          this.startScene(this._current).subscribe();
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
