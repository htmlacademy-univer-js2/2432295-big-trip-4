import {createElement} from '../render';
import { createFormTemplate } from '../template/create-form-template';

export default class NewCreateFormView {
  getTemplate() {
    return createFormTemplate();
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
