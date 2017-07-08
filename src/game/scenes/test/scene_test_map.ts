import { Scene, SceneManager, ResourceManager, AudioManager, PRELOAD_RESOURCE, PRELOAD_DEPENDENCY } from '../../../app';
import { Injector, Injectable } from '../../../di';
import { Map, Character_Actor, CHARACTER_DIRECTION, CHARACTER_STATUS } from '../../sprite';
import { MAP_DATA } from '../../../data';

@PRELOAD_DEPENDENCY([Map])
export class Scene_Test_Map extends Scene {
  protected resourceManager: ResourceManager;
  protected sceneManager: SceneManager;

  private _map: Map;

  constructor(baseInjector: Injector) {
    super(baseInjector);

    this.resourceManager = this.injector.resolve(ResourceManager);
    this.sceneManager = this.injector.resolve(SceneManager);
  }

  public onInit() {
    super.onInit();
    this.addMap();
  }

  public addMap() {
    this._map = this.injector.create(Map);
    this.spriteManager.add(this._map);
    this._map.map = MAP_DATA[0];
  }

  public onEnd() {
    super.onEnd();
  }
}
