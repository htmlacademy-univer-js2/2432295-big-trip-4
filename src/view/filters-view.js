import AbstractView from '../framework/view/abstract-view';
import { createFiltersTemplate } from '../template/filters-template';

export default class NewFiltersView extends AbstractView{
  constructor(filters) { // constructor(filters, onFilterChange)
    super();

    this.#filters = filters;
    //this.#handleFilterChange = onFilterChange;

    //this.element.addEventListener('change', this.#filterChangeHandler);

    /*for (const filter of this.#filters){
      const filterType = `#filter-${filter.type}`;
      this.element.querySelector(filterType).addEventListener('change', this.#filterClickHandler);
    }*/
  }

  #filters;
  //#handleFilterChange = null;


  get filters() {
    return this.#filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
