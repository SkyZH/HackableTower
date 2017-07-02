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
};
