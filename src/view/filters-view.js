import AbstractView from '../framework/view/abstract-view';
import { createFiltersTemplate } from '../template/filters-template';

export default class NewFiltersView extends AbstractView{
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

  get filters() {
    return this.#filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
