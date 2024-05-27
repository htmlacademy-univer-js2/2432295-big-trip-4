import { render, remove, replace } from '../framework/render';
import { UPDATE_TYPE } from '../const';
import { FILTER_OPTIONS } from '../utils';
import NewFiltersView from '../view/filters-view';

export default class FilterPresenter { //all
  constructor({container, pointsModel, filterModel}) { // onFilterTypeChange
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#modelChangeHandler); // handleModelChange
    this.#filterModel.addObserver(this.#modelChangeHandler); // handleModelChange
  }

  #container;
  #pointsModel; //
  #filterModel;
  #filterComponent = null;

  /*#generateFilters = (routePoints) => Object.entries(FILTER_OPTIONS).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      isDisabled: filterPoints(routePoints).length === 0,
    }),
  );*/

  init(){
    //render(this.#filterComponent, this.#container);

    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new NewFiltersView({
      filters: this.filters,
      currentFilterType: this.#filterModel.getFilter(), //
      onFilterTypeChange: this.#filterTypeChangeHandler, //
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }


  #filterTypeChangeHandler = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.set(UPDATE_TYPE.MAJOR, filterType);
  };

  #modelChangeHandler = () => {
    this.init();
  };


  get filters() {
    const routePoints = this.#pointsModel.routePoints;

    return Object.entries(FILTER_OPTIONS).map(([filterType, filterPoints]) => // filter - FILTER_OPTIONS
      ({
        type: filterType,
        isDisabled: filterPoints(routePoints).length === 0,
      }),
    );
  }
}
