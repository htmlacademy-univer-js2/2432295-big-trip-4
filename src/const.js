import { getRoutePointsDayDiff, getRoutePointsEventDiff, getRoutePointsPriceDiff,
  getRoutePointsDurationDiff, getRoutePointsOfferDiff, isFutureDate, isPastDate, isPresentDate } from './utils';


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
  dateFrom: null,
  dateTo:  null,
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
  [FILTER_TYPE.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPE.FUTURE]: 'There are no future events now',
  [FILTER_TYPE.PRESENT]: 'There are no present events now',
  [FILTER_TYPE.PAST]: 'There are no past events now'
};

const CONTAINER = {
  FILTER: document.querySelector('.trip-controls__filters'),
  TRIP_INFO: document.querySelector('.trip-main'),
  EVENTS: document.querySelector('.trip-events')
};


const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const USER_ACTION = {
  UPDATE_POINT: 'UPDATE',
  ADD_POINT: 'ADD',
  DELETE_POINT: 'DELETE',
};

const EDIT_TYPE = { // rn MODE, editPointType rn editPointMode
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  CREATING: 'CREATING',
};
const MODE = { //
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  CREATING: 'CREATING',
};


const TIME_LIMIT = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

const EDIT_POINT_VIEW_BUTTON_TEXT = { //
  SAVE: 'Save',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  LOAD_SAVE: 'Saving...',
  LOAD_DELETE: 'Deleting...'
};


export {DATE_FORMAT, DATE_PERIODS,
  POINT_TYPES, POINT_EMPTY,
  FILTER_TYPE, FILTER_OPTIONS,
  SORT_TYPE, SORT_OPTIONS, ENABLED_SORT_TYPE,
  CONTAINER,
  WARNING_MESSAGE,
  MODE,
  UPDATE_TYPE, USER_ACTION, EDIT_TYPE,
  DEFAULT_DESTINATION,
  TIME_LIMIT,
  EDIT_POINT_VIEW_BUTTON_TEXT
};
