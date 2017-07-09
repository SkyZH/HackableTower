import { MAPOBJECT } from '../const';
import { MapEvent } from '../events';

export interface MapData {
  data: Array<MAPOBJECT>;
  row: number;
  col: number;
  events: MapEvent[];
  name?: string;
};
