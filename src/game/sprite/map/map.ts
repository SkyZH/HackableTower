import { Sprite } from '../../../app';
import { Injector } from '../../../di';
import { Tileset_Map } from '../tileset';

export class Map extends Tileset_Map {
  constructor(baseInjector: Injector) {
    super(baseInjector);
  }
}
