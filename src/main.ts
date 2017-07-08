import './styles/app.scss';
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
