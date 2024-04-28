import { getOffers } from '../mocks/offers';

export default class OffersModel {
  constructor() {
    this.#offers = getOffers();
  }

  #offers = null;

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => (offer.type === type))?.offers;
  }
}
