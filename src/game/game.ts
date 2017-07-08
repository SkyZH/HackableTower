import { SceneManager } from '../app';
import { DEFAULT_SCENE } from './config';
import { Injector, Injectable } from '../di';

export class Main extends Injectable {
  private sceneManager: SceneManager;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.sceneManager = this.injector.resolve(SceneManager);
    this.sceneManager.push(DEFAULT_SCENE);
  }
}

import { Scene_Test_Map } from './scenes';

export class Main_Test_Map extends Injectable {
  private sceneManager: SceneManager;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.sceneManager = this.injector.resolve(SceneManager);
    this.sceneManager.push(Scene_Test_Map);
  }
}

export const Main_Dev = Main_Test_Map;
