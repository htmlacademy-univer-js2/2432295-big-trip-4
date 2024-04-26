import AbstractView from '../framework/view/abstract-view';
import { createRoutePointTemplate } from '../template/route-point-template';

export default class NewRoutePointView extends AbstractView {
  constructor({ routePoint, offers, destination, onEditClick, onFavoriteClick }) {
    super();
    this.#routePoint = routePoint;
    this.#destination = destination;
    this.#offers = offers;

    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.#addRoutePointHandlers();
  }

  #routePoint = null;
  #destination = null;
  #offers = null;

  #handleEditClick = null;
  #handleFavoriteClick = null;

  #addRoutePointHandlers = () => {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  get template() {
    return createRoutePointTemplate(this.#routePoint, this.#destination, this.#offers);
  }
}
