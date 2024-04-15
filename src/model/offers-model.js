import { generateOffersByType } from '../mocks/offers';

export default class OffersModel {
  constructor() {
    this.#offers = generateOffersByType();
  }

  #offers = null;

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => (offer.type === type))?.offers;
  }
}
