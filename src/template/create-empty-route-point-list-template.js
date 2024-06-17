import { WARNING_MESSAGE } from '../const';

export function createEmptyRoutePointsListTemplate(currentFilterType) {
  return (
    `<p class="trip-events__msg">${WARNING_MESSAGE[currentFilterType]}</p>`
  );
}
