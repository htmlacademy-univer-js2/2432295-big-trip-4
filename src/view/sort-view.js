import {createElement} from '../render';
import { createSortTemplate } from '../template/sort-template';

export default class NewSortView {
  getTemplate(){
    return createSortTemplate();
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
