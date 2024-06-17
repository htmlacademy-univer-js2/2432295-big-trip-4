import AbstractView from '../framework/view/abstract-view.js';
import { createEmptyRoutePointsListTemplate } from '../template/create-empty-route-point-list-template.js';


export default class EmptyRoutePointsView extends AbstractView {
  constructor({ currentFilterType, isLoading = false, isLoadingError = false }) {
    super();

    this.#currentFilterType = currentFilterType;
    this.#isLoading = isLoading;
    this.#isLoadingError = isLoadingError;
  }

  #currentFilterType = null;
  #isLoading = false;
  #isLoadingError = false;

  get template() {
    if (this.#isLoading) {
      return '<p class="trip-events__msg">Loading...</p>';
    }
    if (this.#isLoadingError) {
      return '<p class="trip-events__msg">Failed to load latest route information</p>';
    }

    return createEmptyRoutePointsListTemplate(this.#currentFilterType);
  }
}
