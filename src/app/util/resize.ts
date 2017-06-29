import { Observable } from 'rxjs';
import { renderer } from '../app';
import { bound } from './view';

const onResize = () => {
  const [_width, _height] = bound();
  renderer.resize(_width, _height);
};

export const resize$ = Observable.fromEvent(window, 'resize');

onResize();
resize$.subscribe(onResize);
