import { Scene, SceneManager, ResourceManager, AudioManager, PRELOAD_RESOURCE } from '../../app';
import { Injector, Injectable } from '../../di';

@PRELOAD_RESOURCE({
  sound: ['POL-blooming-short.wav'],
  character: ['Braver-08.png']
})
export class Scene_Game extends Scene {
  protected resourceManager: ResourceManager;
  protected sceneManager: SceneManager;
  protected audioManager: AudioManager;

  constructor(baseInjector: Injector) {
    super(baseInjector);

    this.resourceManager = this.injector.resolve(ResourceManager);
    this.sceneManager = this.injector.resolve(SceneManager);
    this.audioManager = this.injector.resolve(AudioManager);
  }

  public onInit() {
    super.onInit();
    this.audioManager.playBGM(this.resourceManager.Sound('POL-blooming-short.wav'));
    this.stage.addChild(this.texture);
  }

  private bound(x: number, y: number, x_split: number, y_split: number, w: number, h: number) {
    return new PIXI.Rectangle(
      (w / x_split) * x,
      (h / y_split) * y,
      w / x_split,
      h / y_split
    );
  }
  public get texture() {
    let baseTexture = this.resourceManager.Character('Braver-08.png').texture;
    let textureArray = [];
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        textureArray.push(new PIXI.Texture(
          baseTexture.baseTexture,
          this.bound(i, j, 4, 4, baseTexture.width, baseTexture.height)
        ));
      }
    }

    let sprite = new PIXI.extras.AnimatedSprite(textureArray);
    sprite.anchor.x = sprite.anchor.y = 0;
    sprite.x = 20;
    sprite.y = 20;
    sprite.play();
    sprite.animationSpeed = 0.05;
    return sprite;
  }
  public onEnd() {
    super.onEnd();
    this.audioManager.stopBGM();
  }
}
