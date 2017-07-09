import 'reflect-metadata';
import * as _ from 'lodash';

import { Observable, Subscriber } from 'rxjs';
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
  

  public Background(name: string): PIXI.loaders.Resource { return this.getPreloaded('background', name); }
  public Sound(name: string): Howl { return this.getPreloaded('sound', name); }
  public Character(name: string): PIXI.loaders.Resource { return this.getPreloaded('character', name); }
  public Tileset(name: string): PIXI.loaders.Resource { return this.getPreloaded('tileset', name); }

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

  public preload(): Observable<number> {
    return new Observable((subscriber: Subscriber<number>) => {
      let progress = 0, total = this.queueSize;
      let _loader = new PIXI.loaders.Loader();

      let onProgress = (do_progress: boolean, check_complete: boolean) => {
        if (do_progress) {
          progress++;
        }
        if (progress >= total && check_complete) {
          subscriber.complete();
        } else {
          subscriber.next(progress);
        }
      };

      _.forOwn(this._preload_queue, (resource, key) => {
        let _src = this.getResource(resource.type, resource.path);
        if (_.includes(RESOURCES_PIXI, resource.type)) {
          _loader.add(key, _src);
        } else if (_.includes(RESOURCES_HOWL, resource.type)) {
          let _sound  =  new Howl({ src: [_src], autoplay: false });
          _sound.once('load', () => {
            this._resources[key] = _sound;
            onProgress(true, true);
          });
        } else {
          onProgress(true, true);
        }
      });

      this._preload_queue = {};

      _loader.load((loader, resources) => {
        this._resources = _.merge(this._resources, resources);
        onProgress(false, true);
      });

      _loader.onLoad.add(() => {
        onProgress(true, false);
      });

      _loader.onComplete.add(() => {
        _loader.destroy();
      });

      onProgress(false, true);
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
};

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
};

export const PRELOAD_FN = (fn) => {
  let __resources = fn();
  return function classDecorator<T extends { new(...args:any[]): Injectable }>(constructor:T) {
    let _c = class extends constructor {
      constructor(...args) {
        super(...args);
        this.injector.resolve(ResourceManager).preparePreload(__resources);
      }
    }
    _c.prototype = constructor.prototype;
    Reflect.set(_c, 'hackabletower:resources', __resources);
    return _c;
  }
};
