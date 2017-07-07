import { Tileset } from '../tileset';
import { Injector } from '../../../di';
import { PRELOAD_RESOURCE } from '../../../app';

@PRELOAD_RESOURCE({
  tileset: ['main.png']
})
export class Tileset_Map extends Tileset {
  constructor(baseInjector: Injector) {
    super(baseInjector);
  }

  onInit() {
    super.onInit();
    this.setTileset('main.png');
    this.setRow(9);
    this.setCol(8);
  }
}
