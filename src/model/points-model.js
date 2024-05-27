import Observable from '../framework/observable';
import { getRandomRoutePoint } from '../mocks/route-point';
import { ROUTE_POINTS_COUNT } from '../const';

export default class PointsModel extends Observable { // all
  constructor() {
    super();
    this.#routePoints = Array.from({ length: ROUTE_POINTS_COUNT }, getRandomRoutePoint);
  }

  #routePoints = null;

  get routePoints() {
    return this.#routePoints;
  }

  update(updateType, update) { // updateRoutePoint
    const index = this.routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting routePoint');
    }

    this.#routePoints = [
      ...this.#routePoints.slice(0, index),
      update,
      ...this.#routePoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  add(updateType, update) { // addRoutePoint
    this.#routePoints = [
      ...this.#routePoints,
      update,
    ];

    this._notify(updateType, update);
  }

  delete(updateType, update) { // deleteRoutePoint
    const index = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting routePoint');
    }

    this.#routePoints = [
      ...this.#routePoints.slice(0, index),
      ...this.#routePoints.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
