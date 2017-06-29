import { Scene } from '../../app';

export class Scene_Main extends Scene {
  constructor() {
    super();

    const style = new PIXI.TextStyle({
      fontFamily: 'Noto Serif',
      fill: '#ffffff'
    });

    const richText = new PIXI.Text('Magic Tower !Hackable', style);
    richText.x = this.viewport.width / 2;
    richText.y = this.viewport.height / 2;
    richText.anchor.set(0.5);

    this.stage.addChild(richText);
  }
}
