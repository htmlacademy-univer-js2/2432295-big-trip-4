//import { generateDestinations } from '../mocks/destinations';

export default class DestinationsModel {
  constructor(apiService) {
    this.#apiService = apiService;
    //this.#destinations = generateDestinations();
  }

  #destinations = null;
  #apiService = null;

  get destinations() {
    return this.#destinations;
  }

  async init() {
    this.#destinations = await this.#apiService.destinations;
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => (destination.id === id));
  }
}
