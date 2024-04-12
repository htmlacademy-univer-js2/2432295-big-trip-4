import { getRandomRoutePoint } from '../mocks/route-point';
import { ROUTE_POINTS_COUNT } from '../const';

export default class PointsModel {
  constructor() {
    this.#routePoints = Array.from({ length: ROUTE_POINTS_COUNT }, getRandomRoutePoint);
  }

  #routePoints = null;

  get routePoints() {
    return this.#routePoints;
  }
}
