import 'core-js/client/shim';
import 'reflect-metadata';
import 'rxjs';
import 'lodash';
import 'moment';
import 'pixi.js';
import 'howler';

import { App } from './app';
import { bootstrap } from './di';
import { Main, Main_Dev } from './game';

let app = bootstrap(App);

if (process.env.ENV === 'build') {
  app.Game(Main);
} else {
  app.Game(Main_Dev);
  Error['stackTraceLimit'] = Infinity;
}
