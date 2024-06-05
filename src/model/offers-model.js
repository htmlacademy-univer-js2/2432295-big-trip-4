//import { getOffers } from '../mocks/offers';

export default class OffersModel {
  constructor(apiService) {
    //this.#offers = getOffers();
    this.#apiService = apiService;
  }

  #offers = null;
  #apiService = null;

  get offers() {
    return this.#offers;
  }

  async init() {
    this.#offers = await this.#apiService.offers;
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => (offer.type === type))?.offers;
  }
}
