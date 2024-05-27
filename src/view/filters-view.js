import AbstractView from '../framework/view/abstract-view';
import { createFiltersTemplate } from '../template/filters-template';

export default class NewFiltersView extends AbstractView{
  constructor({ filters, onFilterTypeChange, currentFilterType }) {
    super();

    this.#filters = filters;
    //this.#handleFilterTypeChange = onFilterChange;

    //this.element.addEventListener('change', this.#filterChangeHandler);

    /*for (const filter of this.#filters) {
      const filterType = `#filter-${filter.type}`;
      this.element.querySelector(filterType).addEventListener('change', this.#filterClickHandler);
    }*/

    this.#handleFilterTypeChange = onFilterTypeChange; //
    this.#currentFilterType = currentFilterType; //

    this.element.addEventListener('change', this.#filterTypeChangeHandler); //
  }

  #filters;
  #currentFilterType; //
  #handleFilterTypeChange = null; //

  #filterTypeChangeHandler = (evt) => { //
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

  get filters() {
    return this.#filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType); //
  }
}
