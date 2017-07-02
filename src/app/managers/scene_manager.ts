import * as _ from 'lodash';
import { Scene } from '../models';
import { App } from '../app';
import { Injector, Injectable } from '../../di';

export class SceneManager extends Injectable {
  private app: App;

  private _scenes: Array<{ new(...args : any[]): Scene }>;
  private _current: Scene;
  private ticker: PIXI.ticker.Ticker;
  
  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(SceneManager, this);
    this.app = this.injector.resolve(App);

    this._scenes = new Array<{ new(): Scene }>();
    this.ticker = new PIXI.ticker.Ticker;
    this.ticker.start();
  }

  private endScene(scene: Scene, cb?: { () }) {
    let __cnt = 0;
    const tick = () => {
      __cnt++;
      if (__cnt >= 60) {
        scene.stage.alpha = 0;
        this.ticker.remove(tick);
        scene.onDestroy();
        if (cb) cb();
      } else scene.stage.alpha = 1 - __cnt / 60;
    };
    this.ticker.add(tick);
    scene.onEnd();
  }

  private startScene(scene: Scene, cb?: { () }) {
    scene.onInit();
    scene.onStart();
    if (cb) cb();
  }
  
  public push <T extends Scene> (scene: { new(...args : any[]): T }) {
    const tick = () => {
      this._scenes.push(scene);
      this._current = this.injector.create(scene);
      this.refresh();
      this.startScene(this._current);
    };
    if (this._current) this.endScene(this._current, tick); else tick();
  }

  public pop() {
    if (_.isEmpty(this._scenes)) {
      throw new Error('scene stack already empty');
    } else {
      this.endScene(this._current, () => {
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

  public goto  <T extends Scene> (scene: { new(...args : any[]): T }) {
    const tick = () => {
      this._scenes = [scene];
      this._current = this.injector.create(scene);
      this.refresh();
      this.startScene(this._current);
    };
    if (this._current) this.endScene(this._current, tick); else tick();
  }

  private refresh() {
    this.app.stage.removeChildren();
    if (this._current) this.app.stage.addChild(this._current.stage)
  }
};
