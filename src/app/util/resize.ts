import { Observable } from 'rxjs';
import { renderer } from '../app';

export const onResize = () => {
  const _width = window.innerWidth;
  const _height = window.innerHeight;

  renderer.resize(_width, _height);
  renderer.view.style.width = `${_width}px`;
  renderer.view.style.height = `${_height}px`;
};

onResize();
Observable.fromEvent(window, 'resize').subscribe(onResize);
