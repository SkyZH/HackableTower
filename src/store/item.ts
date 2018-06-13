import { GAME_STORAGE, STORAGE_DATA, GameStoreBase } from './base';

@GAME_STORAGE('item')
export class Storage_Item extends GameStoreBase {

  constructor(storage: any, target?: string) {
    super(storage, target);
  }
  
  @STORAGE_DATA key_orange: number;
  @STORAGE_DATA key_blue: number;
  @STORAGE_DATA key_red: number;

  public static get DEFAULT() {
    return {
      key_blue: 0,
      key_yellow: 1,
      key_red: 0
    };
  }
}
