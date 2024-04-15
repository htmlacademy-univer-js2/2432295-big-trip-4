import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {MAXIMUM_MINUTE_DIFFERENCE, MAXIMUM_HOUR_DIFFERENCE, MAXIMUM_DAY_DIFFERENCE,
  DATE_FORMAT, DATE_PERIODS,
} from './const';

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

function isFutureDate(dateFrom) {
  return dayjs(dateFrom).isAfter(dayjs());
}
function isPastDate(dateTo) {
  return dayjs(dateTo).isBefore(dayjs());
}
function isPresentDate(dateFrom, dateTo) {
  const now = dayjs();
  return now.isAfter(dayjs(dateFrom)) && now.isBefore(dayjs(dateTo));
}

function sortDay(firstPoint, secondPoint) {
  const firstDate = dayjs(firstPoint.dateFrom);
  const secondDate = dayjs(secondPoint.dateFrom);
  return firstDate.isBefore(secondDate) ? -1 : 1;
}
function sortEvent(firstPoint, secondPoint) {
  return firstPoint.type.toLowerCase().localeCompare(secondPoint.type.toLowerCase());
}
function sortTime(firstPoint, secondPoint) {
  const firstDuration = dayjs(getDateDuration(firstPoint.dateFrom, firstPoint.dateTo)).unix();
  const secondDuration = dayjs(getDateDuration(secondPoint.dateFrom, secondPoint.dateTo)).unix();
  return firstDuration - secondDuration;
}
function sortPrice(firstPoint, secondPoint) {
  return firstPoint.basePrice - secondPoint.basePrice;
}
function sortOffers(firstPoint, secondPoint) {
  return firstPoint.offers.length - secondPoint.offers.length;
}

export { getRandomNumber, getRandomArrayElement, humanizeDate, getDateDuration, getNewRandomValidDate,
  isFutureDate, isPastDate, isPresentDate,
  sortDay, sortEvent, sortTime, sortPrice, sortOffers };
