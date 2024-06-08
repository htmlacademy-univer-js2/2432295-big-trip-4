import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  DATE_FORMAT, DATE_PERIODS,
  SORT_TYPE, SORT_OPTIONS
} from './const';

dayjs.extend(duration);


function humanizeDate(dueDate, format = DATE_FORMAT) {
  if (dueDate === null) {
    return '';
  }
  return dueDate ? dayjs(dueDate).format(format) : '';
}

function getDateDuration(dateFrom, dateTo) {
  const datesDifference = dayjs(dateTo).diff(dayjs(dateFrom));
  const days = dayjs(dateTo).diff(dayjs(dateFrom), 'days');

  let durationTime = 0;
  switch (true) {
    case datesDifference >= DATE_PERIODS.MSEC_IN_DAY * 100:
      durationTime = dayjs.duration(datesDifference).format(`${days}[D] HH[H] mm[M]`);
      break;
    case datesDifference >= DATE_PERIODS.MSEC_IN_DAY:
      durationTime = dayjs.duration(datesDifference).format('DD[D] HH[H] mm[M]');
      break;
    case datesDifference >= DATE_PERIODS.MSEC_IN_HOUR:
      durationTime = dayjs.duration(datesDifference).format('HH[H] mm[M]');
      break;
    case datesDifference < DATE_PERIODS.MSEC_IN_HOUR:
      durationTime = dayjs.duration(datesDifference).format('mm[M]');
      break;
  }

  return durationTime;
}

const isFutureDate = (dateFrom) => dayjs(dateFrom).isAfter(dayjs());
const isPastDate = (dateTo) => dayjs(dateTo).isBefore(dayjs());
const isPresentDate = (dateFrom, dateTo) => {
  const now = dayjs();
  return now.isAfter(dayjs(dateFrom)) && now.isBefore(dayjs(dateTo));
};


const getRoutePointsDayDifference = (firstRoutePoint, secondRoutePoint) => dayjs(firstRoutePoint.dateFrom).diff(dayjs(secondRoutePoint.dateFrom));
const getRoutePointsEventDifference = (firstRoutePoint, secondRoutePoint) => firstRoutePoint.type.localeCompare(secondRoutePoint.type);
const getRoutePointsPriceDifference = (firstRoutePoint, secondRoutePoint) => secondRoutePoint.basePrice - firstRoutePoint.basePrice;
const getRoutePointsDurationDifference = (firstRoutePoint, secondRoutePoint) => dayjs(secondRoutePoint.dateTo).diff(dayjs(secondRoutePoint.dateFrom))
  - dayjs(firstRoutePoint.dateTo).diff(dayjs(firstRoutePoint.dateFrom));
const getRoutePointsOfferDifference = (firstRoutePoint, secondRoutePoint) => firstRoutePoint.offers.length - secondRoutePoint.offers.length;


const sortRoutePoints = (routePoints, sortType = SORT_TYPE.DAY) => SORT_OPTIONS[sortType](routePoints);


function updateRoutePoints(routePoints, update) {
  return routePoints.map((routePoint) => routePoint.id === update.id ? update : routePoint);
}


const isMinorUpdate = (firstRoutePoint, secondRoutePoint) => {
  const firstPointDuration = dayjs(firstRoutePoint.dateTo).diff(dayjs(firstRoutePoint.dateFrom));
  const secondPointDuration = dayjs(secondRoutePoint.dateTo).diff(dayjs(secondRoutePoint.dateFrom));

  return firstRoutePoint.dateFrom !== secondRoutePoint.dateFrom
    || firstRoutePoint.basePrice !== secondRoutePoint.basePrice
    || firstPointDuration !== secondPointDuration;
};


function adaptToServer(routePoint, isAddition = false) {
  const adaptedPoint = {
    ...routePoint,
    ['base_price']: routePoint.basePrice,
    ['date_from']: routePoint.dateFrom instanceof Date ? routePoint.dateFrom.toISOString() : null,
    ['date_to']: routePoint.dateTo instanceof Date ? routePoint.dateTo.toISOString() : null,
    ['is_favorite']: routePoint.isFavorite
  };

  delete adaptedPoint.basePrice;
  delete adaptedPoint.dateFrom;
  delete adaptedPoint.dateTo;
  delete adaptedPoint.isFavorite;
  if (isAddition) {
    delete adaptedPoint.id;
  }

  return adaptedPoint;
}

function adaptToClient(routePoint) {
  const adaptedPoint = {
    ...routePoint,
    basePrice: routePoint['base_price'],
    dateFrom: routePoint['date_from'] !== null ? new Date(routePoint['date_from']) : routePoint['date_from'],
    dateTo: routePoint['date_to'] !== null ? new Date(routePoint['date_to']) : routePoint['date_to'],
    isFavorite: routePoint['is_favorite']
  };

  delete adaptedPoint['base_price'];
  delete adaptedPoint['date_from'];
  delete adaptedPoint['date_to'];
  delete adaptedPoint['is_favorite'];

  return adaptedPoint;
}


function getOffersCost(offersId = [], offers = []) {
  return offersId.reduce(
    (result, id) => result + (offers.find((offer) => offer.id === id)?.price ?? 0),
    0
  );
}

function getTripCost(routePoints = [], offers = []) {
  return routePoints.reduce(
    (result, routePoint) =>
      result + routePoint.basePrice + getOffersCost(routePoint.offers, offers.find((offer) => routePoint.type === offer.type)?.offers),
    0);
}


function getTripInfoTitle(destinations) {
  if (destinations.length > 3) {
    return `${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}`;
  } else {
    return destinations.reduce((acc, destination, index) => {
      if (index !== destinations.length - 1) {
        acc += `${destination} &mdash; `;
      } else {
        acc += `${destination}`;
      }
      return acc;
    }, '');
  }
}

function getTripInfoStartDate(routePoints) {
  return routePoints[0] ? dayjs(routePoints[0].dateFrom).format('DD MMM') : '';
}

function getTripInfoEndDate(routePoints) {
  if (!routePoints[0]) {
    return '';
  }

  const startDate = routePoints[0].dateFrom;
  const endDate = routePoints[routePoints.length - 1].dateTo;

  if (dayjs(startDate).format('MMM') === dayjs(endDate).format('MMM')) {
    return dayjs(endDate).format('DD MMM');
  } else {
    return dayjs(endDate).format('DD MMM');
  }
}


export {
  humanizeDate, getDateDuration, isFutureDate, isPastDate, isPresentDate,
  getRoutePointsDayDifference, getRoutePointsEventDifference, getRoutePointsPriceDifference,
  getRoutePointsDurationDifference, getRoutePointsOfferDifference,
  getOffersCost, getTripCost,
  getTripInfoTitle, getTripInfoStartDate, getTripInfoEndDate,
  sortRoutePoints,
  updateRoutePoints,
  isMinorUpdate,
  adaptToServer, adaptToClient,
};
