import { Character } from './character';
import { Injector } from '../../../di';
import { PRELOAD_RESOURCE } from '../../../app';

export class Charater_Event extends Character {

  private _character_name: string;

  constructor(baseInjector: Injector) {
    super(baseInjector);
  }

  public set eventCharacter(name: string) { this._character_name = name; }

  onInit() {
    this.setCharacter(this._character_name);
    super.onInit();
  }

  public initialize(charater_name: string) {
    super.initialize();
    this._character_name = charater_name;
  }
}
