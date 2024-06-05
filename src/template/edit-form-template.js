import { POINT_TYPES, EDIT_TYPE, DEFAULT_DESTINATION, EDIT_POINT_VIEW_BUTTON_TEXT } from '../const';
import { humanizeDate } from '../utils';


export function createEditFormTemplate({ state, destinations, offersModel, editPointType }) {
  const { id, type, basePrice, dateFrom, dateTo, offers,
    isActive, isSaving, isDeleting, destination } = state;

  const isCreating = editPointType === EDIT_TYPE.CREATING;

  const currentDestination = destination !== null ? destinations.find((dest) => dest.id === destination) : DEFAULT_DESTINATION;
  const currentOffersByType = offersModel.getOffersByType(type);


  return (
    `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                   ${createEventTypesList(type, id, isActive)}

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${id}">
                      ${type}
                    </label>

                    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-${id}" ${isActive ? '' : 'disabled'}>
                    ${destinations ? createDestinationList(destinations, id) : ''}
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-${id}">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text"
                    name="event-start-time" value="${humanizeDate(dateFrom, 'DD/MM/YY HH:mm')}" ${isActive ? '' : 'disabled'}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-${id}">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text"
                    name="event-end-time" value="${humanizeDate(dateTo, 'DD/MM/YY HH:mm')}" ${isActive ? '' : 'disabled'}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-${id}">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${basePrice}" ${isActive ? '' : 'disabled'}>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit"
                    ${isActive ? '' : 'disabled'}>
                    ${isSaving ? EDIT_POINT_VIEW_BUTTON_TEXT.LOAD_SAVE : EDIT_POINT_VIEW_BUTTON_TEXT.SAVE}
                  </button>

                  ${createButtonTemplate(isCreating, isActive, isDeleting)}

                  ${isCreating ? '' : '<button class="event__rollup-btn" type="button"> <span class="visually-hidden">Open event</span> </button>'}
                </header>

                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    ${createOffersList(currentOffersByType, offers, isActive)}
                  </section>

                  ${(currentDestination) ? createDestinationTemplate(currentDestination) : ''}
                </section>
              </form>
            </li>`
  );
}


function createButtonTemplate(isCreating, isActive, isDeleting) {
  let text;
  if (isCreating) {
    text = EDIT_POINT_VIEW_BUTTON_TEXT.CANCEL;
  }
  else {
    text = isDeleting ? EDIT_POINT_VIEW_BUTTON_TEXT.LOAD_DELETE : EDIT_POINT_VIEW_BUTTON_TEXT.DELETE;
  }
  return `<button class="event__reset-btn" type="reset" ${isActive ? '' : 'disabled'}>${text}</button>`;
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

function createEventTypesList(currentType, pointId, isActive) {
  return (`<div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${POINT_TYPES.reduce((acc, type) => (`${acc}
                        <div class="event__type-item">
                          <input id="event-type-${type.toLowerCase()}-${pointId}" class="event__type-input  visually-hidden"
                           type="radio" name="event-type" value="${type.toLowerCase()}" ${type.toLowerCase() === currentType ? 'checked' : ''} ${isActive ? '' : 'disabled'}>
                          <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${pointId}">${type}</label>
                        </div>`), '')}

                      </fieldset>
                    </div>
                  </div>`);
}

function createDestinationList(destinations, id) {
  return (`<datalist id="destination-list-${id}">
                ${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')}
            </datalist>`);
}

function createOffersList(offers, selectedOffers, isActive) {
  if(offers.length === 0) {
    return '';}

  const offerItems = offers.map((offer) => {
    const slug = offer.title.split(' ').at(-1);
    return (`<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" type="checkbox" name="event-offer-${slug}"
                id="event-offer-${slug}-${offer.id}"
                ${selectedOffers?.includes(offer.id) ? 'checked' : '' }
                ${isActive ? '' : 'disabled'}>
                <label class="event__offer-label" for="event-offer-${slug}-${offer.id}">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                </label>
            </div>`);
  }).join('');

  return `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">${offerItems}</div>`;
}

function createPhotosList(photos) {
  return (`        <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('')}
                      </div>
                    </div>`);
}
