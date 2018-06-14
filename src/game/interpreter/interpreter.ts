import * as _ from 'lodash';
import { Injector, Injectable } from '../../di';
import { MapEvent, MapEventData, MAPEVENT_TYPE } from '../../data';
import { GameStorage } from '../../store';
import { Character_Animation, CHARACTER_DIRECTION } from '../sprite/character';
import { Observable, Subscriber } from 'rxjs';

export interface Interpreter_Action {
  animate?: Character_Animation[];
  dispose?: boolean;
  se? : string;
}

export class Interpreter extends Injectable {

  protected GAME_STORAGE: GameStorage;

  constructor(baseInjector: Injector) {
    super(baseInjector);

    this.GAME_STORAGE = this.injector.resolve(GameStorage);    
  }

  public check_item(options_item: any) : boolean {
    let result = true;
    _.forOwn(options_item, (value: number, key) => {
      if (this.GAME_STORAGE.Item.get(key) + value < 0) {
        result = false;
      }
    });
    if (result) {
      _.forOwn(options_item, (value: number, key) => {
        this.GAME_STORAGE.Item.set(key, this.GAME_STORAGE.Item.get(key) + value);
      });
      return true;
    } else return false;
  }

  public interpret(event: MapEvent): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      if (event.data.type == MAPEVENT_TYPE.DOOR) {
        if (this.check_item(event.options.item)) {
          subscriber.next(<Interpreter_Action[]>[
            { se: 'door_open.mp3' },
            { animate: <Character_Animation> [
              { direction: CHARACTER_DIRECTION.LEFT },
              { pause: 200 },
              { direction: CHARACTER_DIRECTION.RIGHT },
              { pause: 200 },
              { direction: CHARACTER_DIRECTION.UP },
              { pause: 200 }
            ]},
            { dispose: true }
          ]);
        } 
      }
      subscriber.complete();
    });
  }
}
