import { Scene, SceneManager, AudioManager, RESOURCE_HELPER as RES, requestExitFullscreen } from '../../app';
import { Scene_Game } from './scene_game';
import { Window_Command } from '../sprite';
import { Command } from '../models';
import { COS } from '../util/animation/cos';
import { FONT } from '../const';


export class Scene_Menu extends Scene {
  constructor() {
    super();
  }

  private get bgSprite() {
    let bg = PIXI.Sprite.fromImage(RES.Background('menu.jpg'));
    bg.anchor.set(0.5, 0.5);
    this.resize$.subscribe(() => {
      bg.width = this.viewport.width;
      bg.height = this.viewport.height;
      bg.x = this.viewport.width / 2;
      bg.y = this.viewport.height / 2;
    });

    this.ticker.add(() => {
      bg.width = this.viewport.width * COS(this.ticker.lastTime, 10000, 1, 1.2);
      bg.height = this.viewport.height * COS(this.ticker.lastTime, 10000, 1, 1.2);
    });

    return bg;
  }

  private get menuWindow() {
    const menuWindow = new Window_Command([
      <Command> { name: '新存档', cb: () => SceneManager.push(Scene_Game) },
      <Command> { name: '加载游戏' },
      <Command> { name: '关于', cb: () => { window.open("https://github.com/SkyZH/HackableTower") } },
      <Command> { name: '设置' },
      <Command> { name: '退出', cb: () => {
        requestExitFullscreen();
        SceneManager.pop();
        window.close();
      }}
    ]);
    this.resize$.subscribe(() => {
      menuWindow.width = 300;
      menuWindow.y = this.viewport.height - 100 - menuWindow.height;
      menuWindow.x = (this.viewport.width - menuWindow.width) / 2;
    });
    
    return menuWindow;
  }

  private get titleText() {
    const style = new PIXI.TextStyle({
      fontFamily: FONT.FONT_FAMILY_TITLE,
      fill: '#ffffff',
      fontSize: FONT.FONT_SIZE_DISPLAY_3,
      stroke: '#000000',
      strokeThickness: 1
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
    AudioManager.playBGM(RES.Sound('POL-evolve-short.wav'));
  }

  onEnd() {
    super.onEnd();
    AudioManager.stopBGM();
  }
}
