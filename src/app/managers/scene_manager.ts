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
  }

  private endScene(scene: Scene) {
    scene.onEnd();
    scene.onDestroy();
  }

  private startScene(scene: Scene) {
    scene.onInit();
    scene.onStart();
  }

  public push(scene: { new(): Scene }) {
    if (this._current) this.endScene(this._current);
    this._scenes.push(scene);
    this._current = new scene;
    this.refresh();
    this.startScene(this._current);
  }

  public pop() {
    if (_.isEmpty(this._scenes)) {
      throw new Error('scene stack already empty');
    } else {
      this.endScene(this._current);
    }

    this._scenes.pop();

    if (!_.isEmpty(this._scenes)) {
      this._current = new (_.last(this._scenes));
      this.refresh();
      this.startScene(this._current);
    } else {
      this.refresh();
      this._current = null;
    }
  }

  public goto(scene: { new(): Scene }) {
    if (this._current) this.endScene(this._current);
    this._scenes = [scene];
    this._current = new scene;
    this.refresh();
    this.startScene(this._current);
  }

  private refresh() {
    stage.removeChildren();
    if (this._current) stage.addChild(this._current.stage)
  }
};

export const SceneManager = new _SceneManager;
