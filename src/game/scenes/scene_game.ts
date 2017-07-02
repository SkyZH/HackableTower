import { Scene, SceneManager, requestFullscreen } from '../../app';
import { Injector, Injectable } from '../../di';

export class Scene_Game extends Scene {
  constructor(baseInjector: Injector) {
    super(baseInjector);
  }
}
