import Observable from '../framework/observable';
import { ROUTE_POINTS_COUNT } from '../const';
import { getRandomRoutePoint } from '../mocks/route-point';

export default class PointsModel extends Observable {
  constructor() {
    super();
    this.#routePoints = Array.from({ length: ROUTE_POINTS_COUNT }, getRandomRoutePoint);
  }

  #routePoints = null;

  get routePoints() {
    return this.#routePoints;
  }

  updateRoutePoints(updateType, update) {
    const insertionIndex = this.routePoints.findIndex((routePoint) => routePoint.id === update.id);

    this.#routePoints = [
      ...this.#routePoints.slice(0, insertionIndex),
      update,
      ...this.#routePoints.slice(insertionIndex + 1),
    ];

    this._notify(updateType, update);
  }

  addRoutePoints(updateType, update) {
    this.#routePoints = [
      ...this.#routePoints,
      update,
    ];

    this._notify(updateType, update);
  }

  deleteRoutePoints(updateType, update) {
    const insertionIndex = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    this.#routePoints = [
      ...this.#routePoints.slice(0, insertionIndex),
      ...this.#routePoints.slice(insertionIndex + 1),
    ];

    this._notify(updateType);
  }
}
