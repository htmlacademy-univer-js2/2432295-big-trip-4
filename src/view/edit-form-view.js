import {createElement} from '../render';
import { createEditFormTemplate } from '../template/edit-form-template';

export default class NewEditFormView {
  getTemplate() {
    return createEditFormTemplate();
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
