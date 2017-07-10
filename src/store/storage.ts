import 'reflect-metadata';
import * as _ from 'lodash';

import { Injectable, Injector } from '../di';
import { GameStoreBase } from './base';
import { Storage_Actor } from './actor';


export class GameStorage extends Injectable {

  private _Actor: Storage_Actor;
  private _storage: {};

  public get Actor() { return this._Actor; }

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(GameStorage, this);
  }

  private getDefault <T extends GameStoreBase> (_cls: { new(...args: any[]): T }) {
    let _s = Reflect.getMetadata('hackabletower:storage', _cls);
    let _obj = {};
    _obj[_s] = _cls['DEFAULT'];
    return _obj;
  }

  public clear() {
    if (this._Actor) this._Actor.onDestroy();
  }
  
  public initialize() {
    this.clear();
    this._storage = _.merge({}, this.getDefault(Storage_Actor));
    this._Actor = new Storage_Actor(this._storage);
  }
};
