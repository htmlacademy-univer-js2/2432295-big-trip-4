import { render, RenderPosition } from '../framework/render.js';
import { updatePoint } from '../utils.js';

import NewTripInfoView from '../view/trip-info-view';
import NewFiltersView from '../view/filters-view';
import NewSortView from '../view/sort-view.js';
import NewRoutePointsView from '../view/route-points-list-view.js';

import RoutePointPresenter from './route-point-presenter';

export default class Presenter {
  constructor({ container, pointsModel, offerModel, destinationModel }) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;

    this.#routePoints = [...this.#pointsModel.routePoints];

    this.#tripInfoViewComponent = new NewTripInfoView(this.#routePoints, this.#destinationModel);
    //this.#filterViewComponent = new NewFiltersView(this.#routePoints);
    //this.#sortViewComponent = new NewSortView();
    this.#routePointsComponent = new NewRoutePointsView(this.#routePoints); // , this.#filterViewComponent.currentFilter.name
  }

  #container = null;
  #pointsModel = null;
  #offerModel = null;
  #destinationModel = null;

  #tripInfoViewComponent = null;
  #filterViewComponent = null;
  #sortViewComponent = null;
  #routePointsComponent = null;

  #routePoints = [];
  #filteredRoutePoints = [];

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
    this.#filterViewComponent = new NewFiltersView({
      routePoints: this.#routePoints,
      onFilterChange: () => {
        this.#filterViewComponent.currentFilter.filter(this.#routePoints);
        //this.#filteredRoutePoints = this.#filterViewComponent.currentFilter.filter(this.#routePoints);
        //this.#renderRoutePointList();
      }
    });

    //this.#filteredRoutePoints = this.#filterViewComponent.currentFilter.filter(this.#routePoints);

    render(this.#filterViewComponent, this.#container.filter);
  }

  #renderSort() {
    this.#sortViewComponent = new NewSortView({
      onSortChange: () => {
        this.#routePoints.sort(this.#sortViewComponent.currentSort);
      }
    });

    render(this.#sortViewComponent, this.#container.events);
    //this.#filteredRoutePoints.sort(this.#sortViewComponent.currentSort);
  }

  #renderRoutePointList() {
    /*this.#routePointsComponent = new NewRoutePointsView(this.#filteredRoutePoints,
      this.#filterViewComponent.currentFilter.name);*/

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

  #clearPoints = () => {
    this.#routePointPresenters.forEach((presenter) => presenter.destroy());
    this.#routePointPresenters.clear();
  };
}
