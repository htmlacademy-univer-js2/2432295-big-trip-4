import AbstractView from '../framework/view/abstract-view.js';
import { createEmptyPointListTemplate } from '../template/empty-route-point-list-template.js';


export default class NewEmptyRoutePointsView extends AbstractView{
  constructor(currentFilterType) {
    super();

    this.#currentFilterType = currentFilterType;
  }

  #currentFilterType = null;

  get template() {
    return createEmptyPointListTemplate(this.#currentFilterType);
  }
}
