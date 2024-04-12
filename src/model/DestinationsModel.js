import { generateDestinations } from '../mocks/destinations';

export default class DestinationsModel {
  constructor() {
    this.#destinations = generateDestinations();
  }

  #destinations = null;

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => (destination.id === id));
  }
}
