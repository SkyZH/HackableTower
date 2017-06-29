import * as _ from 'lodash';
import { renderer, stage } from '../app';
import { Scene } from '../models';

class _SceneManager {
  private _scenes: Array<Scene>;
  
  constructor() {
    this._scenes = new Array<Scene>();
  }

  public push(scene: Scene) {
    this._scenes.push(scene);
    this.refresh();
  }

  public pop() {
    this._scenes.pop();
    this.refresh();
  }

  public goto(scene: Scene) {
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
