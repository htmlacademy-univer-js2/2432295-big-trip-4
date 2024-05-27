import { render, remove } from '../framework/render.js';
import { sortPoints, FILTER_OPTIONS } from '../utils.js'; // filterPoints
import { SORT_TYPE, FILTER_TYPE, UPDATE_TYPE, USER_ACTION } from '../const.js'; //

//import NewTripInfoView from '../view/trip-info-view';
import NewRoutePointsView from '../view/route-points-list-view.js';
import NewEmptyRoutePointsView from '../view/empty-route-point-list-view.js'; //


//import FilterPresenter from './filter-presenter.js';
import SortPresenter from './sort-presenter.js';
import RoutePointPresenter from './route-point-presenter';
import CreatePointPresenter from './create-point-presenter.js'; //


export default class Presenter {
  constructor({ container, pointsModel, offersModel, destinationsModel, filterModel, createPointButtonPresenter }) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#offerModel = offersModel;
    this.#filterModel = filterModel; //
    this.#destinationModel = destinationsModel;

    this.#createPointButtonPresenter = createPointButtonPresenter; //
    this.#createPointPresenter = new CreatePointPresenter({ // зачем в конструкторе + rn
      container: this.#routePointsComponent.element,
      destinationModel: this.#destinationModel,
      offersModel: this.#offerModel,
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#createPointButtonDestroyHandler,
    });

    /*this.#tripInfoViewComponent = new NewTripInfoView(this.#routePoints, this.#destinationModel);
    this.#routePointsComponent = new NewRoutePointsView(this.#routePoints);

    this.#routePoints = sortPoints([...this.#pointsModel.routePoints]);*/

    this.#pointsModel.addObserver(this.#modelEventHandler); //
    this.#filterModel.addObserver(this.#modelEventHandler); //
  }

  #container = null;
  #pointsModel = null;
  #offerModel = null;
  #filterModel = null; //
  #destinationModel = null;

  #routePointsComponent = new NewRoutePointsView();
  #emptyPointListComponent = null;
  //#tripInfoViewComponent = null;

  //#routePoints = [];

  // rn
  #currentSortType = SORT_TYPE.DAY;
  #isCreating = false;
  #createPointButtonPresenter = null;
  #createPointPresenter = null;
  #sortPresenter = null;
  //

  #routePointPresenters = new Map();


  get routePoints() {
    const filterType = this.#filterModel.getFilter();
    const routePoints = this.#pointsModel.routePoints;
    const filteredPoints = FILTER_OPTIONS[filterType](routePoints); // rn

    return sortPoints(filteredPoints, this.#currentSortType);
  }


  init() {
    this.#renderTrip(); //
  }

  #renderTrip() {
    if (!this.routePoints.length && !this.#isCreating) {
      this.#renderEmptyList();
      return;
    }

    //this.#renderTripInfo();

    //this.#renderFilter();
    this.#renderSort();

    this.#renderRoutePointList();
    this.#renderRoutePoints();
  }

  /*
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
  */

  #renderSort() {
    this.#sortPresenter = new SortPresenter({
      container: this.#container.events,
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });

    this.#sortPresenter.init();
  }

  #handleSortTypeChange = (sortType) => {
    //this.#routePoints = sortPoints(this.#routePoints, sortType);

    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearRoutePoints();
    this.#renderRoutePoints();
  };


  #renderRoutePointList() {
    render(this.#routePointsComponent, this.#container.events);
  }

  #renderEmptyList = () => {
    this.#emptyPointListComponent = new NewEmptyRoutePointsView(this.#filterModel.getFilter());
    render(this.#emptyPointListComponent, this.#container.events);
  };

  #renderRoutePoints() {
    this.routePoints.forEach((routePoint) => this.#renderRoutePoint(routePoint));
  }

  #renderRoutePoint = (routePoint) => {
    const routePointPresenter = new RoutePointPresenter({
      routePointListcontainer: this.#routePointsComponent.element,
      offersModel: this.#offerModel,
      destinationsModel: this.#destinationModel,

      onDataChange: this.#viewActionHandler, //onDataChange
      onModeChange: this.#modeChangeHandler, //onModeChange
    });

    routePointPresenter.init(routePoint);
    this.#routePointPresenters.set(routePoint.id, routePointPresenter);
  };

  /*
  #handlePointChange = (updatedPoint) => {
    this.#routePoints = updatePoint(this.#routePoints, updatedPoint);
    this.#routePointPresenters.get(updatedPoint.id).init(updatedPoint);
  };
  */

  #modeChangeHandler = () => {
    this.#routePointPresenters.forEach((routePointPresenter) => routePointPresenter.initialStateView());
  };

  #clearRoutePoints = () => {
    this.#routePointPresenters.forEach((routePointPresenter) => routePointPresenter.destroy());
    this.#routePointPresenters.clear();
    this.#createPointPresenter.destroy(); //
  };


  createPointButtonClickHandler = () => { //
    this.#isCreating = true;
    this.#currentSortType = SORT_TYPE.DAY;
    this.#filterModel.set(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);
    this.#createPointButtonPresenter.disableButton();
    this.#createPointPresenter.init();
  };

  #createPointButtonDestroyHandler = ({isCanceled}) => { //
    this.#isCreating = false;
    this.#createPointButtonPresenter.enableButton();
    if (!this.routePoints.length && isCanceled) {
      this.#clearTrip();
      this.#renderTrip();
    }
  };


  #viewActionHandler = (actionType, updateType, update) => { // handleViewAction
    switch (actionType) {
      case USER_ACTION.UPDATE_POINT:
        this.#pointsModel.update(updateType, update);
        break;
      case USER_ACTION.DELETE_POINT:
        this.#pointsModel.delete(updateType, update);
        break;
      case USER_ACTION.ADD_POINT:
        this.#pointsModel.add(updateType, update);
        break;
    }
  };

  #modelEventHandler = (updateType, data) => { // handleModelEvent
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#routePointPresenters.get(data.id).init(data);
        break;
      case UPDATE_TYPE.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UPDATE_TYPE.MAJOR:
        this.#clearTrip({ resetSortType: true });
        this.#renderTrip();
        break;
    }
  };

  #clearTrip = ({resetSortType = false} = {}) => { //
    this.#clearRoutePoints();
    this.#createPointPresenter.destroy();
    this.#routePointPresenters.forEach((presenter) => presenter.destroy());
    this.#routePointPresenters.clear();
    remove(this.#emptyPointListComponent);

    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
      this.#sortPresenter = null;
    }
    if (resetSortType) {
      this.#currentSortType = SORT_TYPE.DAY;
    }
  };
}
