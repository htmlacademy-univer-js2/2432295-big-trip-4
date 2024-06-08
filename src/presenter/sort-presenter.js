import { render, remove } from '../framework/render';
import { SORT_TYPE, ENABLED_SORT_TYPE } from '../const';
import SortView from '../view/sort-view.js';

export default class SortPresenter {
  constructor({ container, onSortTypeChange, currentSortType }) {
    this.#container = container;
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;
  }

  #container = null;
  #sortComponent = null;

  #handleSortTypeChange = null;

  #currentSortType = SORT_TYPE.DAY;

  init() {
    const sortTypes = this.#renderSortTypes();

    this.#sortComponent = new SortView({
      sorts: sortTypes,
      onSortChange: this.#onSortChange,
    });

    render(this.#sortComponent, this.#container);
  }

  #onSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#handleSortTypeChange(sortType);
  };

  #renderSortTypes = () => Object.values(SORT_TYPE).map((sortType) => ({
    type: sortType,
    isChecked: sortType === this.#currentSortType,
    isDisabled: !ENABLED_SORT_TYPE[sortType],
  }));

  destroy() {
    remove(this.#sortComponent);
  }
}
