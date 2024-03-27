import {OFFERS, RANDOM_PRICE_MAX_LIMIT, RANDOM_PRICE_MIN_LIMIT} from '../const';
import {getRandomArrayElement , getRandomNumber} from '../utils';

function getRandomOffer() {
  return {
    id: crypto.randomUUID(),
    title: getRandomArrayElement(OFFERS),
    price: getRandomNumber(RANDOM_PRICE_MIN_LIMIT, RANDOM_PRICE_MAX_LIMIT)
  };
}

export {getRandomOffer};
