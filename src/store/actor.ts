import { GAME_STORAGE, STORAGE_DATA, GameStoreBase } from './base';

@GAME_STORAGE('actor')
export class Storage_Actor extends GameStoreBase {

  constructor(storage: any, target?: string) {
    super(storage, target);
  }
  @STORAGE_DATA x: number;
  @STORAGE_DATA y: number;
  @STORAGE_DATA direction: number;
  @STORAGE_DATA mapID: string;

  public static get DEFAULT() {
    return {
      x: 7,
      y: 12,
      mapID: 'MAP_0',
      direction: 3
    };
  }
}
