import * as _ from 'lodash';
import { Character } from '../../game/sprite';

export interface MapEventData {
  character: string;
  tileID: number;
  animate?: boolean;
  type: MAPEVENT_TYPE;
  default_options?: any;
};

export interface MapEvent {
  data: MapEventData;
  x: number;
  y: number;
  options?: any;
};

export const E = (data: MapEventData, x: number, y:number, options?: any): MapEvent => {
  return <MapEvent> { data, x, y, options: _.merge(data.default_options || {}, options || {}) };
};

export enum MAPEVENT_TYPE {
  NONE = 0,
  ENEMY,
  DOOR,
  STAIRS,
  ITEM
};
