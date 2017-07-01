import * as _ from 'lodash';
import { renderer, stage } from '../app';
import { Scene } from '../models';

class _SceneManager {
  private _scenes: Array<{ new(): Scene }>;
  private _current: Scene;
  private ticker: PIXI.ticker.Ticker;

  constructor() {
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
  
  public push(scene: { new(): Scene }) {
    const tick = () => {
      this._scenes.push(scene);
      this._current = new scene;
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
          this._current = new (_.last(this._scenes));
          this.refresh();
          this.startScene(this._current);
        } else {
          this.refresh();
          this._current = null;
        }
      });
    }
  }

  public goto(scene: { new(): Scene }) {
    const tick = () => {
      this._scenes = [scene];
      this._current = new scene;
      this.refresh();
      this.startScene(this._current);
    };
    if (this._current) this.endScene(this._current, tick); else tick();
  }

  private refresh() {
    stage.removeChildren();
    if (this._current) stage.addChild(this._current.stage)
  }
};

export const SceneManager = new _SceneManager;
