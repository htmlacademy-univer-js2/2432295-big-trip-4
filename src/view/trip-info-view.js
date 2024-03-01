import {createElement} from '../render';
import { createTripInfoTemplate } from '../template/trip-info-template';

export default class NewTripInfoView {
  getTemplate(){
    return createTripInfoTemplate();
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
