import Observable from '../framework/observable.js';
import { FILTER_TYPE } from '../const.js';

export default class FilterModel extends Observable {
  #currentFilter = FILTER_TYPE.EVERYTHING;

  getFilter() {
    return this.#currentFilter;
  }

  set(updateType, filter) {
    this.#currentFilter = filter;
    this._notify(updateType, filter);
  }
}
