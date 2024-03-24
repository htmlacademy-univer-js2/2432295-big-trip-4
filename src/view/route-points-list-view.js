import {createElement} from '../render';
import { createRoutePointsListTemplate } from '../template/route-points-list-template';

export default class NewRoutePointsView {
  getTemplate() {
    return createRoutePointsListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
