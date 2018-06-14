import * as _ from 'lodash';
import { Injectable, Injector } from '../../di';
import { MAP_DATA, MapData, MapEvent } from '../../data';
import { PRELOAD_FN } from '../../app';

const get_res = (key: string) => _.chain(MAP_DATA)
  .map((map: MapData) => _.map(map.events, (e: MapEvent) => e.data[key]))
  .flatten().flatten().uniq().filter(d => d).value()
@PRELOAD_FN(() => (
  { 
    character: get_res('character'),
    sound: get_res('sound')
  }))
export class MAP_RESOURCE extends Injectable {
  constructor(baseInjector: Injector) {
    super(baseInjector);
  }
};
