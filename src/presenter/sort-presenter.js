import { render, remove } from '../framework/render';
import { SORT_TYPE, ENABLED_SORT_TYPE } from '../const';
import NewSortView from '../view/sort-view.js';

export default class SortPresenter {
  constructor({ container, onSortTypeChange, currentSortType }) {
    this.#container = container;
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;
  }

  #container = null;
  #sortComponent = null;

  #handleSortTypeChange = null;

  #currentSortType = SORT_TYPE.DAY;

  init() {
    const sortTypes = this.#renderSortTypes();

    this.#sortComponent = new NewSortView({
      sorts: sortTypes,
      onSortChange: this.#onSortChange,
    });

    render(this.#sortComponent, this.#container);
  }

  #renderSortTypes = () => Object.values(SORT_TYPE).map((type) => ({
    type,
    isChecked: type === this.#currentSortType,
    isDisabled: !ENABLED_SORT_TYPE[type],
  }));

  #onSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#handleSortTypeChange(sortType);
  };

  destroy() { //
    remove(this.#sortComponent);
  }
}
