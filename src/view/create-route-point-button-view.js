import AbstractView from '../framework/view/abstract-view';
import { createRoutePointButtonTemplate } from '../template/create-route-point-button-template';

export default class CreateRoutePointButtonView extends AbstractView {
  constructor({ onNewRoutePointButtonClick }) {
    super();
    this.#handleNewPointButtonClick = onNewRoutePointButtonClick;
    this.element.addEventListener('click', this.#newPointButtonClickHandler);
  }

  #handleNewPointButtonClick = null;

  setDisable() {
    this.element.disabled = true;
  }

  setEnable() {
    this.element.disabled = false;
  }

  #newPointButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleNewPointButtonClick();
  };

  get template() {
    return createRoutePointButtonTemplate();
  }
}
