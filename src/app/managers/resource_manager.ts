import 'reflect-metadata';
import * as _ from 'lodash';

import { Subject, ReplaySubject } from 'rxjs';
import { Injector, Injectable } from '../../di';
import { GAME_NAME, RESOURCES_PIXI, RESOURCES_HOWL } from '../const';

export class ResourceManager extends Injectable {

  private _resources: any;
  private _preload_queue: any;

  constructor(baseInjector: Injector) {
    super(baseInjector);
    this.injector.provide(ResourceManager, this);
    this._resources = {};
    this._preload_queue = {};
  }
  
  public getResource(type: string, name: string): string { return `/static/${GAME_NAME}/${type}s/${name}`; }

  public getPreloaded(type: string, name: string): any {
    let _path = this.getResource(type, name);
    if (!(_path in this._resources)) {
      throw new Error(`resource "${type} | ${name}" not preloaded`);
    }
    return this._resources[_path];
  }
  

  public Background(name: string) { return this.getPreloaded('background', name); }
  public Sound(name: string) { return this.getResource('sound', name); }
  public Character(name: string) { return this.getPreloaded('character', name); }

  public preparePreload(resources: any) {
    _.forOwn(resources, (paths, type) => {
      _.forEach(paths, path => {
        let _key = this.getResource(type, path);
        if (!(_key in this._preload_queue || _key in this._resources)) {
          this._preload_queue[_key] = { type, path };
        }
      });
    });
  }

  public get queueSize(): number { return _.size(this._preload_queue); }

  public preload(whenProgress: Function) {
    let progress = 0, total = this.queueSize;

    let _loader = new PIXI.loaders.Loader();

    _.forOwn(this._preload_queue, (resource, key) => {
      if (_.includes(RESOURCES_PIXI, resource.type)) {
        _loader.add(key, this.getResource(resource.type, resource.path));
      } else {
        progress++;
      }
    });

    this._preload_queue = {};

    if (progress >= total) {
      whenProgress({ progress, complete: true });
      return ;
    }

    _loader.load((loader, resources) => {
      this._resources = _.merge(this._resources, resources);
    });
    _loader.onProgress.add(() => {
      progress++;
      whenProgress({ progress, complete: false });
    });
    _loader.onComplete.add(() => { 
      whenProgress({ progress, complete: true });
      _loader.destroy();
    });
  }
};

export const PRELOAD_RESOURCE = (data) => {
  return function classDecorator<T extends { new(...args:any[]): Injectable }>(constructor:T) {
    let _c = class extends constructor {
      constructor(...args) {
        super(...args);
        this.injector.resolve(ResourceManager).preparePreload(data);
      }
    }
    _c.prototype = constructor.prototype;
    Reflect.set(_c, 'hackabletower:resources', data);
    return _c;
  }
}

export const PRELOAD_DEPENDENCY = (cls) => {
  return function classDecorator<T extends { new(...args:any[]): Injectable }>(constructor:T) {
    let _c = class extends constructor {
      constructor(...args) {
        super(...args);
        let __resManager = this.injector.resolve(ResourceManager);
        _.forEach(cls, c => {
          __resManager.preparePreload(Reflect.get(c, 'hackabletower:resources'));
        });
      }
    }
    _c.prototype = constructor.prototype;
    return _c;
  }
}
