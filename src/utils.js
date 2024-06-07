import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DATE_FORMAT, DATE_PERIODS,
  SORT_TYPE, SORT_OPTIONS } from './const';

dayjs.extend(duration);


function humanizeDate(dueDate, format = DATE_FORMAT) {
  if (dueDate === null){
    return '';
  }
  return dueDate ? dayjs(dueDate).format(format) : '';
}

function getDateDuration(dateFrom, dateTo) {
  const difference = dayjs(dateTo).diff(dayjs(dateFrom));

  let timeDifference = 0;
  const days = dayjs(dateTo).diff(dayjs(dateFrom), 'days');
  switch (true) {
    case difference >= DATE_PERIODS.MSEC_IN_DAY * 100:
      timeDifference = dayjs.duration(difference).format(`${days}[D] HH[H] mm[M]`);
      break;
    case difference >= DATE_PERIODS.MSEC_IN_DAY:
      timeDifference = dayjs.duration(difference).format('DD[D] HH[H] mm[M]');
      break;
    case difference >= DATE_PERIODS.MSEC_IN_HOUR:
      timeDifference = dayjs.duration(difference).format('HH[H] mm[M]');
      break;
    case difference < DATE_PERIODS.MSEC_IN_HOUR:
      timeDifference = dayjs.duration(difference).format('mm[M]');
      break;
  }

  return timeDifference;
}

const isFutureDate = (dateFrom) => dayjs(dateFrom).isAfter(dayjs());
const isPastDate = (dateTo) => dayjs(dateTo).isBefore(dayjs());
const isPresentDate = (dateFrom, dateTo) => {
  const now = dayjs();
  return now.isAfter(dayjs(dateFrom)) && now.isBefore(dayjs(dateTo));
};


const getRoutePointsDayDiff = (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom));
const getRoutePointsEventDiff = (firstPoint, secondPoint) => firstPoint.type.localeCompare(secondPoint.type);
const getRoutePointsPriceDiff = (firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice;
const getRoutePointsDurationDiff = (firstPoint, secondPoint) => dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom))
- dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom));
const getRoutePointsOfferDiff = (firstPoint, secondPoint) => firstPoint.offers.length - secondPoint.offers.length;


const sortRoutePoints = (routePoints, sortType = SORT_TYPE.DAY) => SORT_OPTIONS[sortType](routePoints);


function updatePoints(points, update) { //
  return points.map((point) => point.id === update.id ? update : point);
}


const isMinorUpdate = (firstPoint, secondPoint) => {
  const firstPointDuration = dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom));
  const secondPointDuration = dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom));

  return firstPoint.dateFrom !== secondPoint.dateFrom
  || firstPoint.basePrice !== secondPoint.basePrice
  || firstPointDuration !== secondPointDuration;
};


function adaptToServer(point, isAddition = false) { // isAddition = false
  const adaptedPoint = {
    ...point,
    ['base_price']: point.basePrice,
    ['date_from']: point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
    ['date_to']: point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
    ['is_favorite']: point.isFavorite
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

function adaptToClient(point) {
  const adaptedPoint = {
    ...point,
    basePrice: point['base_price'],
    dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
    dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
    isFavorite: point['is_favorite']
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

function getTripCost(routePoints = [], offers = []) { //
  return routePoints.reduce(
    (result, routePoint) =>
      result + routePoint.basePrice + getOffersCost(routePoint.offers, offers.find((offer) => routePoint.type === offer.type)?.offers),
    0);
}


function getTripInfoTitle(cities) { //
  if (cities.length > 3) {
    return `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
  } else {
    return cities.reduce((acc, city, index) => {
      if (index !== cities.length - 1) {
        acc += `${city} &mdash; `;
      } else {
        acc += `${city}`;
      }
      return acc;
    }, '');
  }
}

function getTripInfoStartDate(routePoints) {
  return routePoints[0] ? dayjs(routePoints[0].dateFrom).format('DD MMM') : '';
}

function getTripInfoEndDate(routePoints) {
  if (!routePoints[0]){
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


export { humanizeDate, getDateDuration,
  isFutureDate, isPastDate, isPresentDate,
  getRoutePointsDayDiff, getRoutePointsEventDiff, getRoutePointsPriceDiff, getRoutePointsDurationDiff, getRoutePointsOfferDiff,
  sortRoutePoints,
  updatePoints,
  isMinorUpdate,
  adaptToServer, adaptToClient,
  getOffersCost, getTripCost,
  getTripInfoTitle, getTripInfoStartDate, getTripInfoEndDate
};
