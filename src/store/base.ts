import 'reflect-metadata';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { Injectable, Injector } from '../di';

export class GameStorage extends Injectable {
  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(GameStorage, this);
  }
};

export const GAME_STORAGE = (name: string) => {
  return function classDecorator<T extends { new(...args:any[]): GameStoreBase }>(constructor:T) {
    let _c = class extends constructor {
      constructor(...args) {
        super(...args.concat([name]));
      }
    }
    _c.prototype = constructor.prototype;
    return _c;
  }
};

const STORAGE_DATA = function(target: any, propertyKey: string) {
  if (!Reflect.defineProperty(target, propertyKey, {
    set: function(value) { this.set(propertyKey, value); },
    get: function() { return this.get(propertyKey); },
    enumerable: true,
    configurable: true
  })) throw new Error(`define ${propertyKey} failed`);
  Reflect.defineMetadata('hackabletower:storeable', true, target, propertyKey);
};

export abstract class GameStoreBase {
  private _subjects: { [key: string]: Subject<any> };

  constructor(protected storage: any, protected _target?: string) {
    this._subjects = {};
  }

  public get(key: string) {
    this.ensure_key(key);
    return this.storage[this._target][key];
  }

  public set(key: string, value: any) {
    this.ensure_key(key);
    let prev = this.storage[this._target][key];
    this.storage[this._target][key] = value;
    this.invoke(key, value, prev);
  }

  public subscribe(key: string): Subject<any> {
    if (!this._subjects[key]) this._subjects[key] = new Subject<any>();
    return this._subjects[key];
  };
  
  private ensure_key(key: string) {
    if (!Reflect.hasMetadata('hackabletower:storeable', this, key)) throw Error(`${key} not found in ${this._target}`);
  }

  private invoke(key: string, value: any, prev: any) {
    if(this._subjects[key]) this._subjects[key].next({key, value, prev});
  }

  public onDestroy() {
    _.forOwn(this._subjects, (v, k) => {
      v.complete();
    });
  }
}

@GAME_STORAGE('actor')
class Storage_Actor extends GameStoreBase {

  constructor(storage: any, target?: string) {
    super(storage, target);
  }
  @STORAGE_DATA x: number;
}
