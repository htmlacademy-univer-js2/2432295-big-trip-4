const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ';

const OFFERS = [
  'Suite upgrade for luxury stay',
  'Book spa treatment',
  'Complimentary breakfast included every morning',
  'Request late check-out for convenience',
  'Join loyalty program for rewards',
  'Arrange airport transfer for convenience',
  'Upgrade rental car for comfort',
  'Guided city tour available',
  'Room with stunning view',
  'Book tickets for local attractions',
  'Personalize room with extra amenities',
  'Participate in on-site activities',
  'Upgrade Wi-Fi',
  'Arrange romantic dinner package',
  'Use hotel business center',
  'Request child-friendly amenities',
  'Book private airport lounge',
  'Order room service',
  'Access executive lounge for perks',
  'Guided hiking or biking tour',
  'Choose seats'
];

const CITIES = [
  'Tokyo',
  'New York City',
  'Rio de Janeiro',
  'Cairo',
  'Sydney',
  'Istanbul',
  'Bangkok',
  'Dubai',
  'Kyoto',
  'Prague',
  'Moscow',
  'Madrid',
  'Porto',
  'Bordeaux'
];

const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const PHOTO_ADDRESS = 'https://loremflickr.com/248/152?random=';

const MAXIMUM_HOUR_DIFFERENCE = 25;
const MAXIMUM_DAY_DIFFERENCE = 7;
const MAXIMUM_MINUTE_DIFFERENCE = 52;
const OFFERS_LIMIT = 5;
const RANDOM_PRICE_MAX_LIMIT = 1;
const RANDOM_PRICE_MIN_LIMIT = 3000;
const ROUTE_POINTS_COUNT = 4;

const DATE_FORMAT = 'D MMMM';
const DATE_PERIODS = {
  HOURS_IN_DAY: 24,
  MINUTES_IN_HOUR: 60,
  SECONDS_IN_MINUTE: 60,
  MSEC_IN_SECOND: 1000,
  MSEC_IN_HOUR: 60 * 60 * 1000,
  MSEC_IN_DAY: 24 * 60 * 60 * 1000
};

const DEFAULT_TYPE = 'flight';

const POINT_EMPTY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

export {DATE_FORMAT, DATE_PERIODS,
  RANDOM_PRICE_MAX_LIMIT, RANDOM_PRICE_MIN_LIMIT,
  POINT_TYPES, CITIES, DESCRIPTION, OFFERS, PHOTO_ADDRESS,
  MAXIMUM_MINUTE_DIFFERENCE, MAXIMUM_HOUR_DIFFERENCE, MAXIMUM_DAY_DIFFERENCE,
  OFFERS_LIMIT, ROUTE_POINTS_COUNT,
  POINT_EMPTY};
