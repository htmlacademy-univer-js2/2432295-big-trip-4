import { WARNING_MESSAGE } from '../const';

export function createNoRoutePointsTemplate(currentFilterName) {
  const warningMessage = WARNING_MESSAGE[currentFilterName] || 'Warning message error';
  return `<p class="trip-events__msg">${warningMessage}</p>`;
}
