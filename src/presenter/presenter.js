import { RenderPosition, render, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

import { SORT_TYPE, FILTER_TYPE, FILTER_OPTIONS, UPDATE_TYPE, USER_ACTION, TIME_LIMIT } from '../const.js';
import { sortRoutePoints } from '../utils.js';

import SortPresenter from './sort-presenter.js';
import RoutePointPresenter from './route-point-presenter';
import CreateRoutePointPresenter from './create-point-presenter.js';

import RoutePointsListView from '../view/route-points-list-view.js';
import EmptyRoutePointsView from '../view/empty-route-point-list-view.js';
import TripInfoView from '../view/trip-info-view.js';


export default class Presenter {
  constructor({ container, pointsModel, offersModel, destinationsModel, filterModel,
    createRoutePointButtonPresenter }) {
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

  #routePointsListComponent = new RoutePointsListView();
  #emptyRoutePointsListComponent = null;
  #tripInfoComponent = null;

  #currentSortType = SORT_TYPE.DAY;
  #isCreatingMode = false;

  #isLoading = true;
  #isLoadingError = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TIME_LIMIT.LOWER_LIMIT,
    upperLimit: TIME_LIMIT.UPPER_LIMIT
  });


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
    if (this.#isLoading) {
      this.#renderEmptyRoutePointsList({ isLoading: true });
      this.#createRoutePointButtonPresenter.disableButton();
      return;
    }

    if (this.#isLoadingError) {
      this.#renderEmptyRoutePointsList({ isLoadingError: true });
      return;
    }

    this.#createRoutePointButtonPresenter.enableButton();

    this.#renderTripInfo();

    if (!this.routePoints.length && !this.#isCreatingMode) {
      this.#renderEmptyRoutePointsList();
      return;
    }

    this.#renderSort();
    this.#renderRoutePointsList();
    this.#renderRoutePoints();
  }

  #renderTripInfo() {
    const routePoints = this.#pointsModel.routePoints;
    const destinations = this.#destinationsModel.destinations;
    const offers = this.#offersModel.offers;

    this.#tripInfoComponent = new TripInfoView(routePoints, destinations, offers);

    render(this.#tripInfoComponent, this.#container.TRIP_INFO, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    this.#sortPresenter = new SortPresenter({
      container: this.#container.EVENTS,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    this.#sortPresenter.init();
  }

  #renderRoutePointsList() {
    render(this.#routePointsListComponent, this.#container.EVENTS);
  }

  #renderEmptyRoutePointsList = ({ isLoading = false, isLoadingError = false } = {}) => {
    this.#emptyRoutePointsListComponent = new EmptyRoutePointsView({
      currentFilterType: this.#filterModel.getFilter(),
      isLoading,
      isLoadingError
    });
    render(this.#emptyRoutePointsListComponent, this.#container.EVENTS);
  };

  #renderRoutePoints() {
    this.routePoints.forEach((routePoint) => this.#renderRoutePoint(routePoint));
  }

  #renderRoutePoint = (routePoint) => {
    const routePointPresenter = new RoutePointPresenter({
      container: this.#routePointsListComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,

      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    if (this.#emptyRoutePointsListComponent) {
      remove(this.#emptyRoutePointsListComponent);
      this.#renderRoutePointsList();
    }

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
    if (this.#createRoutePointPresenter !== null) {
      this.#createRoutePointPresenter.destroy();
    }

    this.#routePointPresenters.forEach((routePointPresenter) => routePointPresenter.initialStateView());
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#routePointPresenters.get(data.id).init(data);
        this.#renderTripInfo();
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
        if (data.isError) {
          this.#isLoadingError = data.isError;
        }
        this.#isLoading = false;
        this.#clearTrip();
        this.#renderTrip();
        break;
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case USER_ACTION.UPDATE_POINT:
        this.#routePointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updateRoutePoint(updateType, update);
        } catch (err) {
          this.#routePointPresenters.get(update.id).setAborting();
        }
        break;

      case USER_ACTION.ADD_POINT:
        this.#createRoutePointPresenter.setSaving();
        try {
          await this.#pointsModel.addRoutePoint(updateType, update);
        } catch (err) {
          this.#createRoutePointPresenter.setAborting();
        }
        break;

      case USER_ACTION.DELETE_POINT:
        this.#routePointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deleteRoutePoint(updateType, update);
        } catch (err) {
          this.#routePointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleCreatePointButtonDestroy = ({ isCanceled }) => {
    this.#isCreatingMode = false;
    this.#createRoutePointButtonPresenter.enableButton();

    if (!this.routePoints.length && isCanceled) {
      this.#clearTrip();
      this.#renderTrip();
    }
  };


  createRoutePointButtonClickHandler = () => {
    this.#createRoutePointPresenter = new CreateRoutePointPresenter({
      container: this.#routePointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      createRoutePointButton: this.#createRoutePointButtonPresenter,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleCreatePointButtonDestroy,
    });

    if (this.#emptyRoutePointsListComponent) {
      remove(this.#emptyRoutePointsListComponent);
      render(this.#emptyRoutePointsListComponent, this.#container.EVENTS);
    }

    this.#isCreatingMode = true;
    this.#currentSortType = SORT_TYPE.DAY;
    this.#filterModel.set(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);

    this.#createRoutePointPresenter.init();

    this.#createRoutePointButtonPresenter.disableButton();
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
    remove(this.#emptyRoutePointsListComponent);
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
