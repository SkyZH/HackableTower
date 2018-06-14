import { GAME_STORAGE, STORAGE_DATA, GameStoreBase } from './base';

@GAME_STORAGE('event')
export class Storage_Event extends GameStoreBase {

  constructor(storage: any, target?: string) {
    super(storage, target);
  }
  
  @STORAGE_DATA event_disposed: { [id: string] : boolean } ;

  public static get DEFAULT() {
    return {
      event_disposed: {}
    };
  }
}
