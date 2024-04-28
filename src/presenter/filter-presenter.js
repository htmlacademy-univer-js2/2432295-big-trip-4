import { render } from '../framework/render';
import { FILTER_OPTIONS } from '../const';
import NewFiltersView from '../view/filters-view';

export default class FilterPresenter {
  constructor({container, routePoints}) { // onFilterTypeChange
    this.#container = container;
    this.#routePoints = routePoints;

    this.#filters = this.#generateFilters(this.#routePoints);
    this.#filterComponent = new NewFiltersView(this.#filters);
  }

  #container;
  #routePoints;
  #filters;
  #filterComponent;

  #generateFilters = (routePoints) => Object.entries(FILTER_OPTIONS).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      isDisabled: filterPoints(routePoints).length === 0,
    }),
  );

  init(){
    render(this.#filterComponent, this.#container);
  }
}
