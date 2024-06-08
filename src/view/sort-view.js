import AbstractView from '../framework/view/abstract-view';
import { createSortTemplate } from '../template/sort-template';

export default class SortView extends AbstractView {
  constructor({ sorts, onSortChange }) {
    super();

    this.#sorts = sorts;
    this.#handleSortChange = onSortChange;

    this.element.addEventListener('change', this.#sortChangeHandler);
  }

  #sorts = [];
  #handleSortChange = null;

  #sortChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortChange?.(evt.target.dataset.sortType);
  };

  get sorts() {
    return this.#sorts;
  }

  get template() {
    return createSortTemplate({sorts: this.sorts});
  }
}
