import Observable from '../framework/observable';
import { adaptToClient, adaptToServer, updatePoints } from '../utils';
import { UPDATE_TYPE } from '../const';
//import { ROUTE_POINTS_COUNT } from '../const';
//import { getRandomRoutePoint } from '../mocks/route-point';

export default class PointsModel extends Observable {
  constructor({pointsApiService, destinationsModel, offersModel}) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  #routePoints = [];
  #destinationsModel = null;
  #offersModel = null;
  #pointsApiService = null;

  get routePoints() {
    return this.#routePoints;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const points = await this.#pointsApiService.points;
      this.#routePoints = points.map(adaptToClient);
      this._notify(UPDATE_TYPE.INIT, {});
    } catch (err) {
      this.#routePoints = [];
      this._notify(UPDATE_TYPE.INIT, {isError: true});
    }
  }

  async updateRoutePoints(updateType, update) {
    const insertionIndex = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (insertionIndex === -1) {
      throw new Error('Can\'t update non-existing point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(adaptToServer(update));
      const updatedPoint = adaptToClient(response);
      this.#routePoints = updatePoints(this.#routePoints, updatedPoint);
      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async addRoutePoints(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(adaptToServer(update, true));
      const newPoint = adaptToClient(response);
      this.#routePoints.push(newPoint);
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async deleteRoutePoints(updateType, update) {
    const insertionIndex = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (insertionIndex === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update.id);
      this.#routePoints = this.#routePoints.filter((item) => item.id !== update.id);
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }
}
