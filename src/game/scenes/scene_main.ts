import { Observable } from 'rxjs';
import { Scene, SceneManager, requestFullscreen } from '../../app';
import { Scene_Menu } from './scene_menu';
import { COS } from '../util/animation/cos';

export class Scene_Main extends Scene {
  constructor() {
    super();
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

  private get readyText() {
    const style = new PIXI.TextStyle({
      fontFamily: 'Noto Serif',
      fill: '#ffffff',
      fontSize: 16
    });

    const richText = new PIXI.Text('Press any key to continue', style);
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

  private get warningText() {
    const style = new PIXI.TextStyle({
      fontFamily: 'Noto Serif',
      fill: '#ffffff',
      fontSize: 16
    });

    const richText = new PIXI.Text("Processing...", style);
    richText.anchor.set(0.5, 1);

    this.resize$.subscribe(() => {
      richText.x = this.viewport.width / 2;
      richText.y = this.viewport.height - 30;
      richText.text = `Resolution: ${this.viewport.width} x ${this.viewport.height}.`;
    });

    return richText;
  }

  private bindEvents() {
    this.stage.interactive = true;
    this.stage.buttonMode = true;
    this.stage.on('pointerdown', () => {
      SceneManager.push(Scene_Menu);
      requestFullscreen();
    });
  }

  onInit() {
    super.onInit();

    this.stage.addChild(this.titleText);
    this.stage.addChild(this.readyText);
    this.stage.addChild(this.warningText);
  }

  onStart() {
    super.onStart();
    this.bindEvents();
  }
}
