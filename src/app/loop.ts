import { stage } from './app';
import * as View from './util/view';

const style = new PIXI.TextStyle({
    fontFamily: 'Noto Serif',
    fill: '#ffffff'
});

const richText = new PIXI.Text('Magic Tower !Hackable', style);
richText.x = View.width() / 2;
richText.y = View.height() / 2;
richText.anchor.set(0.5);

stage.addChild(richText);
