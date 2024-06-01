import dayjs from 'dayjs';
import { getRoutePointsDayDiff, getRoutePointsEventDiff, getRoutePointsPriceDiff,
  getRoutePointsDurationDiff, getRoutePointsOfferDiff, isFutureDate, isPastDate, isPresentDate } from './utils';

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
const ROUTE_POINTS_COUNT = Math.round(10 * Math.random());

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
const DEFAULT_DESTINATION_ID = null;

const DEFAULT_DESTINATION = {
  id: DEFAULT_DESTINATION_ID,
  description: '',
  name: '',
  pictures: [],
};

const POINT_EMPTY = {
  id: crypto.randomUUID(),
  basePrice: 0,
  dateFrom: dayjs().toDate(),
  dateTo:  dayjs().toDate(),
  destination: DEFAULT_DESTINATION_ID,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};


const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const FILTER_OPTIONS = {
  [FILTER_TYPE.EVERYTHING]: (points) => points,
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isFutureDate(point.dateFrom)),
  [FILTER_TYPE.PRESENT]: (points) => points.filter((point) => isPresentDate(point.dateFrom, point.dateTo)),
  [FILTER_TYPE.PAST]: (points) => points.filter((point) => isPastDate(point.dateTo)),
};


const SORT_TYPE = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const ENABLED_SORT_TYPE = {
  [SORT_TYPE.DAY]: true,
  [SORT_TYPE.EVENT]: false,
  [SORT_TYPE.TIME]: true,
  [SORT_TYPE.PRICE]: true,
  [SORT_TYPE.OFFER]: false,
};

const SORT_OPTIONS = {
  [SORT_TYPE.DAY]: (routePoints) => routePoints.sort(getRoutePointsDayDiff),
  [SORT_TYPE.EVENT]: (routePoints) => routePoints.sort(getRoutePointsEventDiff),
  [SORT_TYPE.PRICE]: (routePoints) => routePoints.sort(getRoutePointsPriceDiff),
  [SORT_TYPE.TIME]: (routePoints) => routePoints.sort(getRoutePointsDurationDiff),
  [SORT_TYPE.OFFER]: (routePoints) => routePoints.sort(getRoutePointsOfferDiff),
};


const WARNING_MESSAGE = {
  [FILTER_TYPE.EVERYTHING]: 'Click New Event to create your first',
  [FILTER_TYPE.FUTURE]: 'There are no future events',
  [FILTER_TYPE.PRESENT]: 'There are no present events',
  [FILTER_TYPE.PAST]: 'There are no past events'
};

const CONTAINER = {
  FILTER: document.querySelector('.trip-controls__filters'),
  TRIP_INFO: document.querySelector('.trip-main'),
  EVENTS: document.querySelector('.trip-events')
};


const MODE = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const USER_ACTION = {
  UPDATE_POINT: 'UPDATE',
  ADD_POINT: 'ADD',
  DELETE_POINT: 'DELETE',
};

const EDIT_TYPE = {
  EDITING: 'EDITING',
  CREATING: 'CREATING',
};


export {DATE_FORMAT, DATE_PERIODS,
  RANDOM_PRICE_MAX_LIMIT, RANDOM_PRICE_MIN_LIMIT,
  POINT_TYPES, CITIES, DESCRIPTION, OFFERS, PHOTO_ADDRESS,
  MAXIMUM_MINUTE_DIFFERENCE, MAXIMUM_HOUR_DIFFERENCE, MAXIMUM_DAY_DIFFERENCE,
  OFFERS_LIMIT, ROUTE_POINTS_COUNT,
  POINT_EMPTY,
  FILTER_TYPE, FILTER_OPTIONS,
  SORT_TYPE, SORT_OPTIONS, ENABLED_SORT_TYPE,
  CONTAINER,
  WARNING_MESSAGE,
  MODE,
  UPDATE_TYPE, USER_ACTION, EDIT_TYPE,
  DEFAULT_DESTINATION
};
