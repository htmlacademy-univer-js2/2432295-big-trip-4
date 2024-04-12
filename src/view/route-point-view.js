import AbstractView from '../framework/view/abstract-view';
import { createRoutePointTemplate } from '../template/route-point-template';

export default class NewRoutePointView extends AbstractView {
  constructor({ routePoint, onEditClick, destination, offers }) {
    super();
    this.#routePoint = routePoint;
    this.#destination = destination;
    this.#offers = offers;

    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  #routePoint = null;
  #handleEditClick = null;
  #destination = null;
  #offers = null;

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  get template() {
    return createRoutePointTemplate(this.#routePoint, this.#destination, this.#offers);
  }
}
