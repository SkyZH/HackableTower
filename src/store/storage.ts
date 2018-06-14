import 'reflect-metadata';
import * as _ from 'lodash';

import { Injectable, Injector } from '../di';
import { GameStoreBase } from './base';
import { Storage_Actor } from './actor';
import { Storage_Item } from './item';

export class GameStorage extends Injectable {

  private _Actor: Storage_Actor;
  private _Item: Storage_Item;
  private _storage: {};

  public get Actor() { return this._Actor; }
  public get Item() { return this._Item; }

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(GameStorage, this);
  }

  private getDefault <T extends GameStoreBase> (_cls: { new(...args): T }) {
    let _s = Reflect.getMetadata('hackabletower:storage', _cls);
    let _obj = {};
    _obj[_s] = _cls['DEFAULT'];
    return _obj;
  }

  public clear() {
    if (this._Actor) this._Actor.onDestroy();
    if (this._Item) this._Item.onDestroy();
  }
  
  public initialize() {
    this.clear();
    this._storage = _.merge({}, 
      this.getDefault(Storage_Actor), 
      this.getDefault(Storage_Item)
    );
    this._Actor = new Storage_Actor(this._storage);
    this._Item = new Storage_Item(this._storage);
  }
};
