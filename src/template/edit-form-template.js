import { POINT_TYPES } from '../const';
import { getRandomNumber, humanizeDate } from '../utils';

export function createEditFormTemplate(routePoint, destinations, offers) {
  const { basePrice, dateFrom, dateTo, type } = routePoint;
  const currentDestination = destinations.find((destination) => destination.id === routePoint.destination);
  const currentOffers = offers.find((offer) => offer.type === type).offers;

  return (
    `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                   ${createEventTypesList(type)}

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-1">
                    ${createDestinationList(destinations)}
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, 'DD/MM/YY HH:mm')}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, 'DD/MM/YY HH:mm')}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                    ${(currentOffers.length !== 0) ? createOffersList(currentOffers) : ''}
                    ${(currentDestination) ? createDestinationTemplate(currentDestination) : ''}
                </section>
              </form>
            </li>`
  );
}

function createDestinationTemplate(currentDestination) {
  if (
    !currentDestination.description.length
    && !currentDestination.pictures.length) {
    return '';
  }

  return (`<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">${currentDestination.name}</h3>
            <p class="event__destination-description">${currentDestination.description}</p>
            ${createPhotosList(currentDestination.pictures)}
            </section>`);
}

function createEventTypesList(currentType) {
  return (`<div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${POINT_TYPES.map((type) =>
      `<div class="event__type-item">
                          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${(type === currentType) ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label>
                        </div>`).join('')}
                      </fieldset>
                    </div>
                  </div>`);
}

function createDestinationList(destinations) {
  return (`<datalist id="destination-list-1">
                ${destinations.map((city) => `<option value="${city.name}"></option>`).join('')}
            </datalist>`);
}

function createOffersList(currentOffers) {
  const offersList = currentOffers.map((offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" data-offer-id="${offer.id}" id="${offer.id}" type="checkbox" name="event-offer-luggage" ${getCheckedOrNot()}>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join('');

  return (`<section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
              ${offersList}
              </div>
           </section>`);
}

function getCheckedOrNot() {
  const isChecked = Boolean(getRandomNumber(0, 1));
  return isChecked ? 'checked' : '';
}

function createPhotosList(photos) {
  return (`        <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('')}
                      </div>
                    </div>`);
}
