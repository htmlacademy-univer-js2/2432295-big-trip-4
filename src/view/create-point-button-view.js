import AbstractView from '../framework/view/abstract-view';
import { createNewPointButtonTemplate } from '../template/create-point-button-template';

export default class CreateRoutePointButtonView extends AbstractView {
  constructor({ onNewPointButtonClick }) {
    super();
    this.#handleNewPointButtonClick = onNewPointButtonClick;
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
    return createNewPointButtonTemplate();
  }
}
