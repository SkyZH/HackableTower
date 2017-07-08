import { MAPOBJECT } from '../const';

export interface MapData {
  data: Array<MAPOBJECT>;
  row: number;
  col: number;
  events: any;
  name?: string;
};
