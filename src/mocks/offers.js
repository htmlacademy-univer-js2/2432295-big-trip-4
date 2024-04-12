import { OFFERS, OFFERS_LIMIT, RANDOM_PRICE_MAX_LIMIT, RANDOM_PRICE_MIN_LIMIT, POINT_TYPES } from '../const';
import { getRandomArrayElement, getRandomNumber } from '../utils';

function generateRandomOffer() {
  return {
    id: crypto.randomUUID(),
    title: getRandomArrayElement(OFFERS),
    price: getRandomNumber(RANDOM_PRICE_MIN_LIMIT, RANDOM_PRICE_MAX_LIMIT)
  };
}

const offersByType = POINT_TYPES.map((type) => (
  {
    type,
    offers: Array.from({ length: getRandomNumber(0, OFFERS_LIMIT) }, generateRandomOffer)
  })
);

const generateOffersByType = () => offersByType;

export { generateOffersByType };
