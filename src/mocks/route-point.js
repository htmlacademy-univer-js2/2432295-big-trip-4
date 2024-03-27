import {POINT_TYPES, RANDOM_PRICE_MIN_LIMIT, RANDOM_PRICE_MAX_LIMIT, OFFERS_LIMIT} from '../const';
import {getRandomArrayElement, getRandomNumber, getNewRandomValidDate} from '../utils';
import {getRandomDestination} from './destinations';
import {getRandomOffer} from './offers';

function getRandomRoutePoint() {
  const offersCount = Math.floor(Math.random() * OFFERS_LIMIT + 1);
  const departureDate = getNewRandomValidDate();

  return {
    id: crypto.randomUUID(),
    basePrice: getRandomNumber(RANDOM_PRICE_MIN_LIMIT, RANDOM_PRICE_MAX_LIMIT),
    dateFrom: departureDate,
    dateTo: getNewRandomValidDate(departureDate),
    destination: getRandomDestination(),
    isFavorite: Boolean(getRandomNumber(0, 1)),
    offers: Array.from({length: offersCount}, () => (getRandomOffer())),
    type: getRandomArrayElement(POINT_TYPES)
  };
}

export {getRandomRoutePoint};
