import * as CONST from './const';
import * as _ from 'lodash';

export const app = new PIXI.Application(800, 600, {
  backgroundColor : CONST.BACKGROUND_COLOR,
  resolution: CONST.RESOLUTION,
  view: <HTMLCanvasElement> document.getElementById('canvas_main')
});

export const renderer = app.renderer;
export const stage = app.stage;