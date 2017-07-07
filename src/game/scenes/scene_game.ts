import { Scene, SceneManager, ResourceManager, AudioManager, PRELOAD_RESOURCE, PRELOAD_DEPENDENCY } from '../../app';
import { Injector, Injectable } from '../../di';
import { Tileset_Map, Character_Actor, CHARACTER_DIRECTION, CHARACTER_STATUS } from '../sprite';

@PRELOAD_RESOURCE({
  sound: ['POL-blooming-short.wav']
})
@PRELOAD_DEPENDENCY([Tileset_Map, Character_Actor])
export class Scene_Game extends Scene {
  protected resourceManager: ResourceManager;
  protected sceneManager: SceneManager;
  protected audioManager: AudioManager;

  private _mapTileset: Tileset_Map;
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
    this.stage.addChild(this.sprite);
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

  public get sprite() {
    this._mapTileset = this.injector.create(Tileset_Map);
    this.spriteManager.add(this._mapTileset);
    let sprite = new PIXI.Sprite(this._mapTileset.getTile(0, 0));
    sprite.anchor.x = sprite.anchor.y = 0;
    sprite.x = 50;
    sprite.y = 50;
    return sprite;
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
