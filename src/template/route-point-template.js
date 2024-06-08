import { getDateDuration, humanizeDate } from '../utils';

export function createRoutePointTemplate(routePoint, destination, allOffers) {
  const { basePrice, dateFrom, dateTo, isFavorite, type, offers } = routePoint;
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
              <div class="event">
              <time class="event__date" datetime="${dateFrom}">${humanizeDate(dateFrom, 'MMM DD')}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom}">${humanizeDate(dateFrom, 'HH:mm')}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo}">${humanizeDate(dateTo, 'HH:mm')}</time>
                  </p>
                  <p class="event__duration">${getDateDuration(dateFrom, dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                ${createRoutePointOffers(allOffers, offers)}
                <button class="event__favorite-btn ${favoriteClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`
  );
}

function createRoutePointOffers(allOffers, checkedOffers) {
  return allOffers ?
    `<ul class="event__selected-offers">
        ${allOffers.map((offer) => checkedOffers.includes(offer.id) ? `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
          </li>` : '').join('')}
      </ul>` : '';
}
