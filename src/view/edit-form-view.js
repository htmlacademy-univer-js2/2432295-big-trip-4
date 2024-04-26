import AbstractView from '../framework/view/abstract-view';
import { createEditFormTemplate } from '../template/edit-form-template';
import { POINT_EMPTY } from '../const';

export default class NewEditFormView extends AbstractView {
  constructor({ routePoint = POINT_EMPTY, destination, offers, allDestinations, onEditFormSubmitClick, onEditFormResetClick }) {
    super();
    this.#routePoint = routePoint;
    this.#destination = destination;
    this.#offers = offers;
    this.#allDestinations = allDestinations;

    this.#handleEditFormSubmitClick = onEditFormSubmitClick;
    this.#handleEditFormResetClick = onEditFormResetClick;

    this.#addEditFormHandlers();
  }

  #routePoint = null;
  #destination = null;
  #offers = null;
  #allDestinations = null;

  #handleEditFormSubmitClick = null;
  #handleEditFormResetClick = null;

  #addEditFormHandlers = () => {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#resetClickHandler);
    this.element
      .querySelector('.event--edit')
      .addEventListener('submit', this.#submitClickHandler);
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormResetClick();
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormSubmitClick();
  };

  get template() {
    return createEditFormTemplate(this.#routePoint, this.#destination, this.#offers, this.#allDestinations);
  }
}
