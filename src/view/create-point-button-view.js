import AbstractView from '../framework/view/abstract-view';
import { createNewPointButtonTemplate } from '../template/create-point-button-template';

export default class CreatePointButtonView extends AbstractView { //all
  #handleClick = null;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  setDisabled = (isDisabled) => {
    this.element.disabled = isDisabled;
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
