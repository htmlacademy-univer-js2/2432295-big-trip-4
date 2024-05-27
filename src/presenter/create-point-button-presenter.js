import { render } from '../framework/render';
import CreatePointButtonView from '../view/create-point-button-view';

export default class CreatePointButtonPresenter { //all
  #container = null;
  #button = null;

  constructor({ container }) {
    this.#container = container;
  }

  init = ({ onClick }) => {
    this.#button = new CreatePointButtonView({ onClick });
    render(this.#button, this.#container);
  };

  disableButton() {
    this.#button.setDisabled(true);
  }

  enableButton() {
    this.#button.setDisabled(false);
  }
}
