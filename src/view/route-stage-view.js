import {createElement} from '../render';
import { createRouteStageTemplate } from '../template/route-stage-template';

export default class NewRouteStageView {
  getTemplate() {
    return createRouteStageTemplate();
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
