import { MapEventData, MAPEVENT_TYPE } from './event';

export const Door_Orange = <MapEventData> {
  character: 'Door-01.png',
  sound: 'door_open.mp3',
  tileID: 0,
  type: MAPEVENT_TYPE.DOOR,
  default_options: {
    item: {
      key_orange: -1
    }
  }
};

export const Door_Blue = <MapEventData> {
  character: 'Door-01.png',
  sound: 'door_open.mp3',
  tileID: 1,
  type: MAPEVENT_TYPE.DOOR,
  default_options: {
    item: {
      key_blue: -1
    }
  }
};

export const Door_Red = <MapEventData> {
  character: 'Door-01.png',
  sound: 'door_open.mp3',
  tileID: 2,
  type: MAPEVENT_TYPE.DOOR,
  default_options: {
    item: {
      key_red: -1
    }
  }
};

export const Door_Block = <MapEventData> {
  character: 'Door-01.png',
  sound: 'door_open.mp3',
  tileID: 3,
  type: MAPEVENT_TYPE.NONE
};
