import Observable from '../framework/observable.js';
import { FILTER_TYPE } from '../const.js';

export default class FilterModel extends Observable { //all
  #currFilter = FILTER_TYPE.EVERYTHING;

  getFilter () {
    return this.#currFilter;
  }

  set (updateType, filter) {
    this.#currFilter = filter;
    this._notify(updateType, filter);
  }
}
