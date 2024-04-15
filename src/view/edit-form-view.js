import AbstractView from '../framework/view/abstract-view';
import { createEditFormTemplate } from '../template/edit-form-template';
import { POINT_EMPTY } from '../const';

export default class NewEditFormView extends AbstractView {
  constructor({ routePoint = POINT_EMPTY, onSubmitClick, onRollUpClick, destination, offers, allDestinations }) {
    super();
    this.#routePoint = routePoint;
    this.#destination = destination;
    this.#offers = offers;
    this.#allDestinations = allDestinations;

    this.#handleSubmitClick = onSubmitClick;
    this.#handleRollUpClick = onRollUpClick;

    this.element.querySelector('.event--edit').addEventListener('submit', this.#submitClickHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpClickHandler);
  }

  #routePoint = null;
  #destination = null;
  #offers = null;
  #allDestinations = null;

  #handleSubmitClick = null;
  #handleRollUpClick = null;

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitClick();
  };

  #rollUpClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollUpClick();
  };

  get template() {
    return createEditFormTemplate(this.#routePoint, this.#destination, this.#offers, this.#allDestinations);
  }
}
