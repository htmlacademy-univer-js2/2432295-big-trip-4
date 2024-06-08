import AbstractView from '../framework/view/abstract-view';
import { createTripInfoTemplate } from '../template/trip-info-template';

export default class TripInfoView extends AbstractView {
  constructor(routePoints, destinations, offers) {
    super();

    this.#routePoints = routePoints;
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
