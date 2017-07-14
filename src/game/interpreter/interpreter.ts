import { Injector, Injectable } from '../../di';
import { MapEvent, MapEventData, MAPEVENT_TYPE } from '../../data';
import { GameStorage } from '../../store';

export class Interpreter extends Injectable {

  protected GAME_STORAGE: GameStorage;

  constructor(baseInjector: Injector) {
    super(baseInjector);

    this.GAME_STORAGE = this.injector.resolve(GameStorage);    
  }

  public interpret(event: MapEvent) {
    if (event.data.type == MAPEVENT_TYPE.ITEM) {

    }
  }
}
