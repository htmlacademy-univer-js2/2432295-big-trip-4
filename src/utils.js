import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {MAXIMUM_MINUTE_DIFFERENCE, MAXIMUM_HOUR_DIFFERENCE, MAXIMUM_DAY_DIFFERENCE,
  DATE_FORMAT, DATE_PERIODS} from './const';

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
    date = dayjs()
      .subtract(getRandomNumber(0, MAXIMUM_DAY_DIFFERENCE), 'day').toDate();
  }

  if (date < previousDate) {
    throw new Error(`New date ${date} is less than the previous one ${previousDate}`);
  }

  return date;
}

export {getRandomNumber, getRandomArrayElement, humanizeDate, getDateDuration, getNewRandomValidDate };
