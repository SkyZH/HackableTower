export interface MapEventData {
  character: string;
  tileID: number;
  animate?: boolean;
};

export interface MapEvent {
  data: MapEventData;
  x: number;
  y: number;
};

export const E = (data: MapEventData, x: number, y:number): MapEvent => {
  return <MapEvent> { data, x, y };
};
