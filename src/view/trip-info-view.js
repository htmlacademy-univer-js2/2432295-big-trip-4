import AbstractView from '../framework/view/abstract-view';
import { createTripInfoTemplate } from '../template/trip-info-template';

export default class NewTripInfoView extends AbstractView {
  constructor(points, destinations, offers) {
    super();

    this.#routePoints = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  #routePoints = null;
  #destinations = null;
  #offers = null;

  get template() {
    return createTripInfoTemplate(this.#routePoints, this.#destinations, this.#offers);
  }
}
