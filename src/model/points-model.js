import Observable from '../framework/observable';
import { adaptToClient, adaptToServer, updateRoutePoints } from '../utils';
import { UPDATE_TYPE } from '../const';


export default class PointsModel extends Observable {
  constructor({ tripApiService, destinationsModel, offersModel }) {
    super();
    this.#tripApiService = tripApiService;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  #routePoints = [];
  #destinationsModel = null;
  #offersModel = null;
  #tripApiService = null;

  get routePoints() {
    return this.#routePoints;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const routePoints = await this.#tripApiService.points;
      this.#routePoints = routePoints.map(adaptToClient);
      this._notify(UPDATE_TYPE.INIT, {});
    } catch (err) {
      this.#routePoints = [];
      this._notify(UPDATE_TYPE.INIT, { isError: true });
    }
  }

  async updateRoutePoint(updateType, update) {
    const insertionIndex = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (insertionIndex === -1) {
      throw new Error('Can\'t update non-existing routePoint');
    }

    try {
      const response = await this.#tripApiService.updatePoint(adaptToServer(update));
      const updatedRoutePoint = adaptToClient(response);
      this.#routePoints = updateRoutePoints(this.#routePoints, updatedRoutePoint);
      this._notify(updateType, updatedRoutePoint);
    } catch (err) {
      throw new Error('Can\'t update routePoint');
    }
  }

  async addRoutePoint(updateType, update) {
    try {
      const response = await this.#tripApiService.addPoint(adaptToServer(update, true));
      const newRoutePoint = adaptToClient(response);
      this.#routePoints.push(newRoutePoint);
      this._notify(updateType, newRoutePoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async deleteRoutePoint(updateType, update) {
    const insertionIndex = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (insertionIndex === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      await this.#tripApiService.deletePoint(update.id);
      this.#routePoints = this.#routePoints.filter((routePoint) => routePoint.id !== update.id);
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }
}
