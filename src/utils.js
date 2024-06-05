import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { MAXIMUM_MINUTE_DIFFERENCE, MAXIMUM_HOUR_DIFFERENCE, MAXIMUM_DAY_DIFFERENCE,
  DATE_FORMAT, DATE_PERIODS,
  SORT_TYPE, SORT_OPTIONS } from './const';

dayjs.extend(duration);

function getRandomNumber(min, max) {
  const lowerNumber = Math.ceil(Math.min(min, max));
  const upperNumber = Math.floor(Math.max(min, max));

  return Math.floor(lowerNumber + Math.random() * (upperNumber - lowerNumber + 1));
}

function getRandomArrayElement(items) {
  return items[getRandomNumber(0, items.length - 1)];
}

function humanizeDate(dueDate, format = DATE_FORMAT) {
  return dueDate ? dayjs(dueDate).format(format) : '';
}

function getDateDuration(dateFrom, dateTo) {
  const dateDifference = dayjs(dateTo).diff(dayjs(dateFrom));
  let dateDuration = 0;

  if (dateDifference >= DATE_PERIODS.MSEC_IN_DAY) {
    dateDuration = dayjs.duration(dateDifference).format('DD[D] HH[H] mm[M]');
  } else if (dateDifference >= DATE_PERIODS.MSEC_IN_HOUR) {
    dateDuration = dayjs.duration(dateDifference).format('HH[H] mm[M]');
  } else if (dateDifference < DATE_PERIODS.MSEC_IN_HOUR) {
    dateDuration = dayjs.duration(dateDifference).format('mm[M]');
  }

  return dateDuration;
}

function getNewRandomValidDate(previousDate = 0) {
  let date = dayjs();

  if (typeof previousDate !== 'number') {
    date = dayjs(date)
      .add(getRandomNumber(0, MAXIMUM_DAY_DIFFERENCE), 'day')
      .add(getRandomNumber(0, MAXIMUM_HOUR_DIFFERENCE), 'hour')
      .add(getRandomNumber(0, MAXIMUM_MINUTE_DIFFERENCE), 'minute')
      .toDate();
  } else {
    const futureOrPast = Math.random() < 0.5 ? -1 : 1;
    date = dayjs()
      .add(getRandomNumber(0, MAXIMUM_DAY_DIFFERENCE) * futureOrPast, 'day').toDate();
  }

  return date;
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


const isMajorDiff = (firstPoint, secondPoint) => {
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


/*_________________________________________________________*/


function getOffersCost(offerIds = [], offers = []) { //
  return offerIds.reduce(
    (result, id) => result + (offers.find((offer) => offer.id === id)?.basePrice ?? 0),
    0
  );
}


function getTripCost(points = [], offers = []) { //
  return points.reduce(
    (result, point) =>
      result + point.basePrice + getOffersCost(point.offers, offers.find((offer) => point.type === offer.type)?.offers),
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

function getTripInfoStartDate(sortedPoints) { //
  return dayjs(sortedPoints[0].dateFrom).format('MMM DD');
}

function getTripInfoEndDate(sortedPoints) { //
  const startDate = sortedPoints[0].dateFrom;
  const endDate = sortedPoints[sortedPoints.length - 1].dateTo;
  if (dayjs(startDate).format('MMM') === dayjs(endDate).format('MMM')) {
    return dayjs(endDate).format('DD');
  } else {
    return dayjs(endDate).format('MMM DD');
  }
}


export { getRandomNumber, getRandomArrayElement, humanizeDate, getDateDuration, getNewRandomValidDate,
  isFutureDate, isPastDate, isPresentDate,
  getRoutePointsDayDiff, getRoutePointsEventDiff, getRoutePointsPriceDiff, getRoutePointsDurationDiff, getRoutePointsOfferDiff,
  sortRoutePoints,
  updatePoints,
  isMajorDiff,
  adaptToServer, adaptToClient,
  getOffersCost, getTripCost,
  getTripInfoTitle, getTripInfoStartDate, getTripInfoEndDate
};
