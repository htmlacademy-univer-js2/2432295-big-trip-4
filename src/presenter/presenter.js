import { RenderPosition, render, remove } from '../framework/render.js';
import { sortRoutePoints } from '../utils.js';
import {
  SORT_TYPE, FILTER_TYPE, FILTER_OPTIONS,
  UPDATE_TYPE, USER_ACTION
} from '../const.js';

import SortPresenter from './sort-presenter.js';
import RoutePointPresenter from './route-point-presenter';
import CreateRoutePointPresenter from './create-point-presenter.js';

import NewRoutePointsView from '../view/route-points-list-view.js';
import NewEmptyRoutePointsView from '../view/empty-route-point-list-view.js';
import NewTripInfoView from '../view/trip-info-view.js';


export default class Presenter {
  constructor({ container, pointsModel, offersModel, destinationsModel, filterModel, createRoutePointButtonPresenter }) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#createRoutePointButtonPresenter = createRoutePointButtonPresenter;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #filterModel = null;
  #destinationsModel = null;

  #createRoutePointButtonPresenter = null;
  #createRoutePointPresenter = null;
  #sortPresenter = null;
  #routePointPresenters = new Map();

  #routePointsComponent = new NewRoutePointsView();
  #emptyPointListComponent = null;
  #tripInfoComponent = null;

  #currentSortType = SORT_TYPE.DAY;
  #isCreatingModeNow = false;


  get routePoints() {
    const filterType = this.#filterModel.getFilter();
    const routePoints = this.#pointsModel.routePoints;
    const filteredPoints = FILTER_OPTIONS[filterType](routePoints);

    return sortRoutePoints(filteredPoints, this.#currentSortType);
  }


  init() {
    this.#renderTrip();
  }


  #renderTrip() {
    if (!this.routePoints.length && !this.#isCreatingModeNow) {
      this.#renderEmptyList();
      return;
    }

    this.#renderTripInfo();
    this.#renderSort();
    this.#renderRoutePointList();
    this.#renderRoutePoints();
  }

  #renderTripInfo() { //
    this.#tripInfoComponent = new NewTripInfoView(this.routePoints, this.#destinationsModel.destinations, this.#offersModel.offers);
    render(this.#tripInfoComponent, this.#container.TRIP_INFO, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    this.#sortPresenter = new SortPresenter({
      container: this.#container.EVENTS,
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });

    this.#sortPresenter.init();
  }

  #renderRoutePointList() {
    render(this.#routePointsComponent, this.#container.EVENTS);
  }

  #renderEmptyList = () => {
    this.#emptyPointListComponent = new NewEmptyRoutePointsView(this.#filterModel.getFilter());
    render(this.#emptyPointListComponent, this.#container.EVENTS);
  };

  #renderRoutePoints() {
    this.routePoints.forEach((routePoint) => this.#renderRoutePoint(routePoint));
  }

  #renderRoutePoint = (routePoint) => {
    const routePointPresenter = new RoutePointPresenter({
      container: this.#routePointsComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,

      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    routePointPresenter.init(routePoint);
    this.#routePointPresenters.set(routePoint.id, routePointPresenter);
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearRoutePoints();
    this.#renderRoutePoints();
  };

  #handleModeChange = () => {
    this.#routePointPresenters.forEach((routePointPresenter) => routePointPresenter.initialStateView());
  };


  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#routePointPresenters.get(data.id).init(data);
        break;
      case UPDATE_TYPE.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UPDATE_TYPE.MAJOR:
        this.#clearTrip({ sortTypeReset: true });
        this.#renderTrip();
        break;
      case UPDATE_TYPE.INIT:
        //this.#isLoading = false;
        //this.#addPointButton.disabled = false;
        this.#clearTrip();
        this.#renderTrip();
        break;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case USER_ACTION.UPDATE_POINT:
        this.#pointsModel.updateRoutePoints(updateType, update);
        break;
      case USER_ACTION.DELETE_POINT:
        this.#pointsModel.deleteRoutePoints(updateType, update);
        break;
      case USER_ACTION.ADD_POINT:
        this.#pointsModel.addRoutePoints(updateType, update);
        break;
    }
  };


  #handleCreatePointButtonDestroy = ({ isCanceled }) => {
    this.#isCreatingModeNow = false;
    this.#createRoutePointButtonPresenter.enableButton();

    if (!this.routePoints.length && isCanceled) {
      this.#clearTrip();
      this.#renderTrip();
    }
  };

  createRoutePointButtonClickHandler = () => {
    this.#createRoutePointPresenter = new CreateRoutePointPresenter({
      container: this.#routePointsComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleCreatePointButtonDestroy,
    });
    this.#createRoutePointButtonPresenter.disableButton();

    this.#isCreatingModeNow = true;
    this.#currentSortType = SORT_TYPE.DAY;
    this.#filterModel.set(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);

    this.#createRoutePointPresenter.init();
  };


  #clearRoutePoints = () => {
    this.#routePointPresenters.forEach((routePointPresenter) => routePointPresenter.destroy());
    this.#routePointPresenters.clear();
    this.#createRoutePointPresenter?.destroy();
  };

  #clearTrip = ({ sortTypeReset = false } = {}) => {
    this.#clearRoutePoints();
    this.#createRoutePointPresenter?.destroy();
    this.#routePointPresenters.forEach((presenter) => presenter.destroy());
    this.#routePointPresenters.clear();
    remove(this.#emptyPointListComponent);
    remove(this.#tripInfoComponent);

    if (sortTypeReset) {
      this.#currentSortType = SORT_TYPE.DAY;
    }
    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
      this.#sortPresenter = null;
    }
  };
}
