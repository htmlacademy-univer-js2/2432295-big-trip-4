import { render, RenderPosition } from '../framework/render.js';
import { updatePoint, sortPoints } from '../utils.js';

import NewTripInfoView from '../view/trip-info-view';
import NewRoutePointsView from '../view/route-points-list-view.js';

import FilterPresenter from './filter-presenter.js';
import SortPresenter from './sort-presenter.js';
import RoutePointPresenter from './route-point-presenter';

export default class Presenter {
  constructor({ container, pointsModel, offerModel, destinationModel }) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;

    this.#routePoints = sortPoints([...this.#pointsModel.routePoints]);

    this.#tripInfoViewComponent = new NewTripInfoView(this.#routePoints, this.#destinationModel);
    this.#routePointsComponent = new NewRoutePointsView(this.#routePoints);
  }

  #container = null;
  #pointsModel = null;
  #offerModel = null;
  #destinationModel = null;

  #tripInfoViewComponent = null;
  #routePointsComponent = null;

  #routePoints = [];

  #routePointPresenters = new Map();


  init() {
    this.#renderTripInfo();

    this.#renderFilter();
    this.#renderSort();

    this.#renderRoutePointList();
    this.#renderRoutePoints();
  }

  #renderTripInfo() {
    render(this.#tripInfoViewComponent, this.#container.tripInfo, RenderPosition.AFTERBEGIN);
  }

  #renderFilter() {
    const filterPresenter = new FilterPresenter({
      container: this.#container.filter,
      routePoints: this.#routePoints
    });

    filterPresenter.init();
  }

  #renderSort() {
    const sortPresenter = new SortPresenter({
      container: this.#container.events,
      handleSortTypeChange: this.#handleSortTypeChange,
    });

    sortPresenter.init();
  }

  #handleSortTypeChange = (sortType) => {
    this.#routePoints = sortPoints(this.#routePoints, sortType);
    this.#clearRoutePoints();
    this.#renderRoutePoints();
  };


  #renderRoutePointList() {
    render(this.#routePointsComponent, this.#container.events);
  }

  #renderRoutePoints() {
    this.#routePoints.forEach((routePoint) => this.#renderRoutePoint(routePoint));
  }

  #renderRoutePoint = (routePoint) => {
    const routePointPresenter = new RoutePointPresenter({
      routePointListcontainer: this.#routePointsComponent.element,
      offersModel: this.#offerModel,
      destinationsModel: this.#destinationModel,

      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    routePointPresenter.init(routePoint);
    this.#routePointPresenters.set(routePoint.id, routePointPresenter);
  };

  #handlePointChange = (updatedPoint) => {
    this.#routePoints = updatePoint(this.#routePoints, updatedPoint);
    this.#routePointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#routePointPresenters.forEach((routePointPresenter) => routePointPresenter.initialStateView());
  };

  #clearRoutePoints = () => {
    this.#routePointPresenters.forEach((routePointPresenter) => routePointPresenter.destroy());
    this.#routePointPresenters.clear();
  };
}
