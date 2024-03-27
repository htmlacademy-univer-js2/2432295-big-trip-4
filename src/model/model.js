import {getRandomRoutePoint} from '../mocks/route-point';
import {ROUTE_POINTS_COUNT} from '../const';

export default class Model {
  routePoints = Array.from({length: ROUTE_POINTS_COUNT}, getRandomRoutePoint);

  getRoutePoints() {
    return this.routePoints;
  }
}
