import { FILTER_TYPE, WARNING_MESSAGE } from '../const';

export function createNoRoutePointsTemplate(currentFilterName) {
  let warningMessage;

  switch (currentFilterName) {
    case FILTER_TYPE.EVERYTHING:
      warningMessage = WARNING_MESSAGE[FILTER_TYPE.EVERYTHING];
      break;
    default:
      warningMessage = 'Error';
      break;
  }

  return `<p class="trip-events__msg">${warningMessage}</p>`;
}
