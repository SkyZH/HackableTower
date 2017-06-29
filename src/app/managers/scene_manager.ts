import * as _ from 'lodash';
import { renderer, stage } from '../app';
import { Scene } from '../models';

class _SceneManager {
  private _scenes: Array<Scene>;
  
  constructor() {
    this._scenes = new Array<Scene>();
  }

  public push(scene: Scene) {
    scene.onInit();
    this._scenes.push(scene);
    scene.onStart();
    this.refresh();
  }

  public pop() {
    if (_.isEmpty(this._scenes)) {
      throw new Error('scene stack already empty');
    }
    let _lstScene = _.last(this._scenes);
    _lstScene.onEnd();
    this._scenes.pop();
    _lstScene.onDestroy();
    this.refresh();
  }

  public goto(scene: Scene) {
    if (!_.isEmpty(this._scenes)) {
      let _lstScene = _.last(this._scenes);
      _lstScene.onEnd();
      this._scenes.pop();
      _lstScene.onDestroy();
    }
    scene.onInit();
    this._scenes = [scene];
    this.refresh();
  }

  private refresh() {
    stage.removeChildren();
    if (!_.isEmpty(this._scenes)) {
      stage.addChild(_.last(this._scenes).stage)
    }
  }
};

export const SceneManager = new _SceneManager;
