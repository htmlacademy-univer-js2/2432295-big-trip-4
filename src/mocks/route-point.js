import { POINT_TYPES, RANDOM_PRICE_MIN_LIMIT, RANDOM_PRICE_MAX_LIMIT, CITIES } from '../const';
import { getRandomArrayElement, getRandomNumber, getNewRandomValidDate } from '../utils';
import { generateDestinations } from './destinations';
import { generateOffersByType } from './offers';

function getRandomRoutePoint() {
  const type = getRandomArrayElement(POINT_TYPES);
  const departureDate = getNewRandomValidDate();

  const destinationId = getRandomArrayElement(generateDestinations()).id;
  const offersId = generateOffersByType(type).map((offer) => offer.id);

  return {
    id: getRandomNumber(0, CITIES.length - 1),
    basePrice: getRandomNumber(RANDOM_PRICE_MIN_LIMIT, RANDOM_PRICE_MAX_LIMIT),
    dateFrom: departureDate,
    dateTo: getNewRandomValidDate(departureDate),
    destination: destinationId,
    isFavorite: Boolean(getRandomNumber(0, 1)),
    offers: offersId,
    type: getRandomArrayElement(POINT_TYPES)
  };
}

export { getRandomRoutePoint };
