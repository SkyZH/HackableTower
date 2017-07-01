import { Scene, SceneManager, AudioManager, RESOURCE_HELPER as RES, requestExitFullscreen } from '../../app';
import { Window_Command } from '../sprite';
import { Command } from '../models';

export class Scene_Menu extends Scene {
  constructor() {
    super();
  }

  private get bgSprite() {
    let bg = PIXI.Sprite.fromImage(RES.Background('menu.jpg'));
    bg.anchor.set(0, 0);
    this.resize$.subscribe(() => {
      bg.width = this.viewport.width;
      bg.height = this.viewport.height;
    });
    return bg;
  }

  private get menuWindow() {
    const window = new Window_Command([
      <Command> { name: '新存档' },
      <Command> { name: '加载游戏' },
      <Command> { name: '关于', cb: () => SceneManager.pop() },
      <Command> { name: '退出', cb: () => {
        requestExitFullscreen();
        SceneManager.pop();
      }}
    ]);
    this.resize$.subscribe(() => {
      window.width = 300;
      window.y = this.viewport.height - 100 - window.height;
      window.x = (this.viewport.width - window.width) / 2;
    });
    
    return window;
  }

  private get titleText() {
    const style = new PIXI.TextStyle({
      fontFamily: 'Noto Serif',
      fill: '#ffffff'
    });

    const richText = new PIXI.Text('Magic Tower !Hackable', style);
    this.resize$.subscribe(() => {
      richText.x = this.viewport.width / 2;
      richText.y = this.viewport.height / 2;
    });

    richText.anchor.set(0.5);

    return richText;
  }

  onInit() {
    super.onInit();

    this.stage.addChild(this.bgSprite);
    this.stage.addChild(this.titleText);
    this.spriteManager.add(this.menuWindow);
  }

  onStart() {
    super.onStart();
    AudioManager.play(RES.Sound('POL-evolve-short.wav'));
  }

  onEnd() {
    super.onEnd();
    AudioManager.stop();
  }
}
