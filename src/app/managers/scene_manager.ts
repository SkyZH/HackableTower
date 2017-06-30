import * as _ from 'lodash';
import { renderer, stage } from '../app';
import { Scene } from '../models';

class _SceneManager {
  private _scenes: Array<Scene>;

  constructor() {
    this._scenes = new Array<Scene>();
  }

  private endScene(scene: Scene) {
    scene.onEnd();
    scene.onDestroy();
  }

  private startScene(scene: Scene) {
    scene.onInit();
    scene.onStart();
  }

  public push(scene: Scene) {
    if (!_.isEmpty(this._scenes)) this.endScene(_.last(this._scenes));
    this._scenes.push(scene);
    this.refresh();
    this.startScene(scene);
  }

  public pop() {
    if (_.isEmpty(this._scenes)) {
      throw new Error('scene stack already empty');
    } else {
      this.endScene(_.last(this._scenes));
    }

    this._scenes.pop();
    this.refresh();
    if (!_.isEmpty(this._scenes)) this.startScene(_.last(this._scenes));
  }

  public goto(scene: Scene) {
    if (!_.isEmpty(this._scenes)) this.endScene(_.last(this._scenes));
    this._scenes = [scene];
    this.refresh();
    this.startScene(scene);
  }

  private refresh() {
    stage.removeChildren();
    if (!_.isEmpty(this._scenes)) {
      stage.addChild(_.last(this._scenes).stage)
    }
  }
};

export const SceneManager = new _SceneManager;
