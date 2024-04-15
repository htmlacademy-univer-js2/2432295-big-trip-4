import AbstractView from '../framework/view/abstract-view';
import { createFiltersTemplate } from '../template/filters-template';
import {FILTER_OPTIONS, DEFAULT_FILTER} from '../const';

export default class NewFiltersView extends AbstractView{
  constructor({ routePoints, onFilterChange }) {
    super();

    this.#filters = this.#generateFilters(routePoints);
    this.#handleFilterChange = onFilterChange;

    for (const filter of this.#filters){
      const filterType = `#filter-${filter.type}`;
      this.element.querySelector(filterType).addEventListener('change', this.#filterClickHandler);
    }
  }

  #filters;
  #currentFilter = DEFAULT_FILTER;

  #handleFilterChange = null;

  #generateFilters(routePoints) {
    return Object.entries(FILTER_OPTIONS).map(
      ([filterType, filterPoints]) => ({
        type: filterType,
        isDisabled: filterPoints(routePoints).length === 0,
      }),
    );
  }

  get currentFilter() {
    return this.#currentFilter;
  }

  get filters() {
    return this.#filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }

  #filterClickHandler = (evt) => {
    evt.preventDefault();
    const currentFilterName = evt.target.value.split('-')[0];
    this.#currentFilter = {
      name: currentFilterName,
      filter: FILTER_OPTIONS[currentFilterName]
    };

    this.#handleFilterChange();
  };
}
