import AbstractView from '../framework/view/abstract-view';
import { createSortTemplate } from '../template/sort-template';
import { SORT_OPTIONS, DEFAULT_SORT } from '../const';

export default class NewSortView extends AbstractView {
  constructor({ onSortChange }) {
    super();

    this.#handleSortChange = onSortChange;

    for (const sortName of Object.keys(SORT_OPTIONS)) {
      const sortType = `#sort-${sortName}`;
      this.element.querySelector(sortType).addEventListener('change', this.#sortClickHandler);
    }
  }

  #handleSortChange = null;
  #currentSort = DEFAULT_SORT;

  get currentSort() {
    return this.#currentSort;
  }

  get template() {
    return createSortTemplate();
  }

  #sortClickHandler = (evt) => {
    evt.preventDefault();
    const sortTypeFromTarget = evt.target.value.split('-')[1];
    this.#currentSort = SORT_OPTIONS[sortTypeFromTarget];
    this.#handleSortChange();
  };
}
