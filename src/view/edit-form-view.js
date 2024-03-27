import {createElement} from '../render';
import { createEditFormTemplate } from '../template/edit-form-template';
import { POINT_EMPTY } from '../const';

export default class NewEditFormView {
  constructor({routePoint = POINT_EMPTY}) {
    this.routePoint = routePoint;
  }

  getTemplate() {
    return createEditFormTemplate(this.routePoint);
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
