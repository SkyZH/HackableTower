import * as _ from 'lodash';
import { Injectable, Injector } from '../../di';
import { MAP_DATA, MapData, MapEvent } from '../../data';
import { PRELOAD_FN } from '../../app';

@PRELOAD_FN(() => ({ character:  _.chain(MAP_DATA)
  .map((map: MapData) => _.map(map.events, (e: MapEvent) => e.data.character))
  .union().union().value()
}))
export class MAP_RESOURCE extends Injectable {
  constructor(baseInjector: Injector) {
    super(baseInjector);
  }
};
