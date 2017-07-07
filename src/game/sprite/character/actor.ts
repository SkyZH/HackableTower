import { Character } from './character';
import { Injector } from '../../../di';
import { PRELOAD_RESOURCE } from '../../../app';
@PRELOAD_RESOURCE({
  character: ['Braver-08.png']
})
export class Character_Actor extends Character {
  
  constructor(baseInjector: Injector) {
    super(baseInjector);
  }

  onInit() {
    this.setCharacter('Braver-08.png');
    super.onInit();
  }
}
