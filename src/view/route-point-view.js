import {createElement} from '../render';
import { createRoutePointTemplate } from '../template/route-point-template';

export default class NewRoutePointView {
  constructor({routePoint}) {
    this.routePoint = routePoint;
  }

  getTemplate() {
    return createRoutePointTemplate(this.routePoint);
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
