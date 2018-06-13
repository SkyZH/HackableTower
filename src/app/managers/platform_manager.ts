import { Observable, fromEvent } from 'rxjs';
import * as _ from 'lodash';

import { Injector, Injectable } from '../../di';
import { bound, requestExitFullscreen, requestFullscreen } from '../platform';
import { App } from '../app';

export class PlatformManager extends Injectable {
  private app: App;
  
  private _resize$: Observable<any>;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(PlatformManager, this);

    this.app = this.injector.resolve(App);

    this._resize$ = fromEvent(window, 'resize');
    this.resize$.subscribe(this.onResize);
    this.onResize();
  }

  public get resize$() { return this._resize$; }

  private onResize = () => {
    const [_width, _height] = bound();
    this.app.renderer.resize(_width, _height);
  }

  public requestExitFullscreen() { requestExitFullscreen(); }
  public requestFullscreen() { requestFullscreen(); }
};
