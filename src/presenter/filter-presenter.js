import { render, remove, replace } from '../framework/render';
import { UPDATE_TYPE, FILTER_OPTIONS } from '../const';
import NewFiltersView from '../view/filters-view';

export default class FilterPresenter {
  constructor({container, pointsModel, filterModel}) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);
  }

  #container;

  #pointsModel;
  #filterModel;

  #filterComponent = null;

  get filters() {
    const routePoints = this.#pointsModel.routePoints;

    return Object.entries(FILTER_OPTIONS).map(([filterType, filterPoints]) =>
      ({
        type: filterType,
        isDisabled: filterPoints(routePoints).length === 0,
      }),
    );
  }

  init(){
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new NewFiltersView({
      filters: this.filters,
      currentFilterType: this.#filterModel.getFilter(),
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }


  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.set(UPDATE_TYPE.MAJOR, filterType);
  };

  #handleModelChange = () => {
    this.init();
  };
}
