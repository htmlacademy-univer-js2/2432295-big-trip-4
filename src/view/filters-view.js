import AbstractView from '../framework/view/abstract-view';
import { createFiltersTemplate } from '../template/create-filters-template';

export default class FiltersView extends AbstractView {
  constructor({ filters, onFilterTypeChange, currentFilterType }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;

    this.#handleFilterTypeChange = onFilterTypeChange;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filters;
  #currentFilterType;
  #handleFilterTypeChange = null;

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

  get filters() {
    return this.#filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }
}
