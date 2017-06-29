import { Observable } from 'rxjs';
import { renderer } from '../app';
import { bound } from './view';

export const onResize = () => {
  const [_width, _height] = bound();
  renderer.resize(_width, _height);
};

onResize();
Observable.fromEvent(window, 'resize').subscribe(onResize);
