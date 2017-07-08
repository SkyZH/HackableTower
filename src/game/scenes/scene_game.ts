import { Scene, SceneManager, ResourceManager, AudioManager, PRELOAD_RESOURCE, PRELOAD_DEPENDENCY } from '../../app';
import { Injector, Injectable } from '../../di';
import { Map, Character_Actor, CHARACTER_DIRECTION, CHARACTER_STATUS } from '../sprite';
import { MAP_DATA } from '../../data';
import { MAP_RESOURCE } from '../resources';

@PRELOAD_RESOURCE({
  sound: ['POL-blooming-short.wav']
})
@PRELOAD_DEPENDENCY([Map, Character_Actor, MAP_RESOURCE])
export class Scene_Game extends Scene {
  protected resourceManager: ResourceManager;
  protected sceneManager: SceneManager;
  protected audioManager: AudioManager;

  private _map: Map;
  private _actor: Character_Actor;

  constructor(baseInjector: Injector) {
    super(baseInjector);

    this.resourceManager = this.injector.resolve(ResourceManager);
    this.sceneManager = this.injector.resolve(SceneManager);
    this.audioManager = this.injector.resolve(AudioManager);
  }

  public onInit() {
    super.onInit();
    this.audioManager.playBGM(this.resourceManager.Sound('POL-blooming-short.wav'));
    this.addMap();
    this.addActor();
    this.bindEvents();
  }

  private bound(x: number, y: number, x_split: number, y_split: number, w: number, h: number) {
    return new PIXI.Rectangle(
      (w / x_split) * x,
      (h / y_split) * y,
      w / x_split,
      h / y_split
    );
  }

  public addMap() {
    this._map = this.injector.init(Map)(MAP_DATA[0]);
    this.spriteManager.add(this._map);
  }

  public bindEvents() {
    this.stage.interactive = true;
    this.stage.on('pointerdown', () => {
      this._actor.status = (this._actor.status + 1) % 3;
      this._actor.direction = (this._actor.direction + 1) % 4;
    });
  }

  public addActor() {
    this._actor = this.injector.create(Character_Actor);
    this.spriteManager.add(this._actor);
    this._actor.direction = CHARACTER_DIRECTION.LEFT;
    this._actor.status = CHARACTER_STATUS.WALKING;
  }

  public onEnd() {
    super.onEnd();
    this.audioManager.stopBGM();
    this.stage.interactive = false;
  }
}
