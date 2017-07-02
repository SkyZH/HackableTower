import './styles/app.scss';
import { App } from './app';
import { bootstrap } from './di';
import { Main } from './game';

let app = bootstrap(App);
app.Game(Main);
