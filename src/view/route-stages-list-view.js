import {createElement} from '../render';
import { createRouteStagesListTemplate } from '../template/route-stages-list-template';

export default class NewRouteStagesView {
  getTemplate() {
    return createRouteStagesListTemplate();
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
