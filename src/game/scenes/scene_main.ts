import { Observable } from 'rxjs';
import { Injector, Injectable } from '../../di';
import { Scene, SceneManager, PlatformManager } from '../../app';
import { Scene_Menu } from './scene_menu';
import { COS } from '../util/animation/cos';
import { FONT } from '../const';

export class Scene_Main extends Scene {
  protected sceneManager: SceneManager;
  
  constructor(baseInjector: Injector) {
    super(baseInjector);

    this.sceneManager = this.injector.resolve(SceneManager);
  }

  private get titleText() {
    const style = new PIXI.TextStyle({
      fontFamily: FONT.FONT_FAMILY_TITLE,
      fill: '#ffffff',
      fontSize: FONT.FONT_SIZE_DISPLAY_3
    });

    const richText = new PIXI.Text('Magic Tower !Hackable', style);
    this.resize$.subscribe(() => {
      richText.x = this.viewport.width / 2;
      richText.y = this.viewport.height / 2;
    });

    richText.anchor.set(0.5);

    return richText;
  }

  private get copyrightText() {
    const style = new PIXI.TextStyle({
      fontFamily: FONT.FONT_FAMILY_TITLE,
      fill: '#cccccc',
      fontSize: FONT.FONT_SIZE_BODY
    });

    const richText = new PIXI.Text('This is an open-source project by SkyZH.', style);
    this.resize$.subscribe(() => {
      richText.x = this.viewport.width / 2;
      richText.y = this.viewport.height - 50;
    });

    richText.anchor.set(0.5);

    return richText;
  }

  private get readyText() {
    const style = new PIXI.TextStyle({
      fontFamily: FONT.FONT_FAMILY_BODY,
      fill: '#ffffff',
      fontSize: FONT.FONT_SIZE_BODY
    });

    const richText = new PIXI.Text('点击屏幕继续', style);
    richText.anchor.set(0.5);

    this.resize$.subscribe(() => {
      richText.x = this.viewport.width / 2;
      richText.y = this.viewport.height / 2 + 40;
    });

    this.ticker.add(() => {
      richText.alpha = COS(this.ticker.lastTime, 2000);
    });

    return richText;
  }

  onInit() {
    super.onInit();

    this.stage.addChild(this.titleText);
    this.stage.addChild(this.readyText);
    this.stage.addChild(this.copyrightText);
  }

  onStart() {
    super.onStart();
    this.bindEvents();
  }

  onEnd() {
    super.onEnd();
    this.stage.interactive = false;
    this.stage.buttonMode = false;
  }

  private bindEvents() {
    this.stage.interactive = true;
    this.stage.buttonMode = true;
    this.stage.on('pointerdown', () => {
      this.sceneManager.push(Scene_Menu);
      this.platformManager.requestFullscreen();
    });
  }

}
