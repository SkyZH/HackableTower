import { Scene, SceneManager, ResourceManager, AudioManager, PlatformManager, PRELOAD_DEPENDENCY } from '../../../app';
import { Injector, Injectable } from '../../../di';
import { Map, Character_Actor, CHARACTER_DIRECTION, CHARACTER_STATUS } from '../../sprite';
import { MAP_DATA } from '../../../data';
import { MAP_RESOURCE } from '../../resources';

@PRELOAD_DEPENDENCY([Map, MAP_RESOURCE])
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
    this.resize$.subscribe(() => {
      this._map.x = (this.viewport.width - this._map.width) / 2;
      this._map.y = (this.viewport.height - this._map.height) / 2;
    });
  }

  public addMap() {
    this._map = this.injector.init(Map)(MAP_DATA[0]);
    this.spriteManager.add(this._map);
  }

  public onEnd() {
    super.onEnd();
  }
}
