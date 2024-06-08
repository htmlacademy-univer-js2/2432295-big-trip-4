import { render } from '../framework/render';
import CreateRoutePointButtonView from '../view/create-point-button-view';

export default class CreateRoutePointButtonPresenter {
  #container = null;
  #createRoutePointButton = null;

  constructor({ container }) {
    this.#container = container;
  }

  init = ({ onNewRoutePointButtonClick }) => {
    this.#createRoutePointButton = new CreateRoutePointButtonView({ onNewRoutePointButtonClick });
    render(this.#createRoutePointButton, this.#container);
  };

  disableButton() {
    this.#createRoutePointButton.setDisable();
  }

  enableButton() {
    this.#createRoutePointButton.setEnable();
  }
}
