import { generateDestinations } from '../mocks/destinations';
import { CITIES } from '../const';

export default class DestinationsModel {
  constructor() {
    this.#destinations = generateDestinations();
    this.#allDestinations = CITIES;
  }

  #destinations = null;
  #allDestinations = null;

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => (destination.id === id));
  }

  get allDestinations() {
    return this.#allDestinations;
  }
}
