import { MapPosition, MapStatus } from './map';
import * as _ from 'lodash';

interface ROUTE_STATUS {
  x: number;
  y: number;
  prev: number;
  direction: number;
};

const generate_route = (queue: Array<ROUTE_STATUS>, current: number) => {
  let route = [];
  while(current != -1) {
    route.push(<MapStatus>{ x: queue[current].x, y: queue[current].y, direction: queue[current].direction });
    current = queue[current].prev;
  }
  _.reverse(route);
  return route;
};

const ROUTE_DIRECTION = [
  [0, -1, 1, 0],
  [1, 0, 0, -1]
];

export const Map_GetRoute = (start: MapPosition, end: MapPosition, connection: boolean[][]): MapStatus[] => {
  let queue: Array<ROUTE_STATUS> = [<ROUTE_STATUS>{ x: start.x, y: start.y, prev: -1, direction: null }];
  let visited: boolean[][] = _.map(_.range(connection.length), () => _.times(connection[0].length, _.constant(false)));
  let __front = 0;
  visited[start.x][start.y] = true;

  while(__front < queue.length) {
    let current = queue[__front];
    for (let i = 0; i < 4; i++) {
      let x = current.x + ROUTE_DIRECTION[0][i];
      let y = current.y + ROUTE_DIRECTION[1][i];
      if (x < 0 || y < 0 || x >= connection.length || y >= connection[0].length) continue;
      if (visited[x][y]) continue;
      if (connection && !connection[x][y]) continue;
      visited[x][y] = true;
      queue.push(<ROUTE_STATUS>{ x, y, prev: __front, direction: i });
      if (x == end.x && y == end.y) return generate_route(queue, queue.length - 1);
    }
    ++__front;
  }
  let __nearest = _.minBy(
    _.map(queue, (q, id) => _.merge(q, {id})),
    s => (Math.abs(s.x - end.x) + Math.abs(s.y - end.y))
  );
  return generate_route(queue, __nearest.id);
};
