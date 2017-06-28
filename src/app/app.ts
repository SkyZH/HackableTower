import { BACKGROUND_COLOR, PIXI_SETTINGS } from './const';
import * as _ from 'lodash';

_(PIXI_SETTINGS).forEach((v, k) => PIXI.settings[k] = v);

export const app = new PIXI.Application(800, 600, {backgroundColor : BACKGROUND_COLOR});
export const renderer = app.renderer;
export const stage = app.stage;

document.body.appendChild(app.view);
