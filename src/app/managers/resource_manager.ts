import * as _ from 'lodash';

import { Injector, Injectable } from '../../di';
import { GAME_NAME } from '../const';

export class ResourceManager extends Injectable {
  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(ResourceManager, this);
  }
  
  public getResource(type: string, name: string): string { return `/static/${GAME_NAME}/${type}s/${name}`; }
  public Background(name: string) { return this.getResource('background', name); }
  public Sound(name: string) { return this.getResource('sound', name); }

  public preload(resources: any) {
  }
};

export const PRELOAD_RESOURCE = (data) => {
  return function classDecorator<T extends { new(...args:any[]): Injectable }>(constructor:T) {
    let _c = class extends constructor {
      constructor(...args) {
        super(...args);
        this.injector.resolve(ResourceManager).preload(data);
      }
    }
    _c.prototype = constructor.prototype;
    return _c;
  }
}
