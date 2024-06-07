import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createEditFormTemplate } from '../template/edit-form-template';
import { POINT_EMPTY, EDIT_TYPE } from '../const';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


export default class NewEditFormView extends AbstractStatefulView {
  constructor({ routePoint = POINT_EMPTY, destinations, offersModel,
    onEditFormSubmitClick, onEditFormResetClick, onEditFormDeleteClick,
    editPointType = EDIT_TYPE.EDITING }) {
    super();
    this.#destinations = destinations;
    this.#offersModel = offersModel;

    this.#handleEditFormSubmitClick = onEditFormSubmitClick;
    this.#handleEditFormResetClick = onEditFormResetClick;
    this.#handleEditFormDeleteClick = onEditFormDeleteClick;

    this.#editPointType = editPointType;

    this._setState(NewEditFormView.parsePointToState(routePoint));
    this._restoreHandlers();
  }

  #destinations = null;
  #offersModel = null;

  #handleEditFormSubmitClick = null;
  #handleEditFormResetClick = null;
  #handleEditFormDeleteClick = null;

  #editPointType = null;

  #datepickerFrom = null;
  #datepickerTo = null;


  static parsePointToState(routePoint) {
    return { ...routePoint,
      isActive: true,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const routePoint = {...state};
    delete routePoint.isActive;
    delete routePoint.isSaving;
    delete routePoint.isDeleting;
    return routePoint;
  }


  _restoreHandlers = () => {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#handleSubmitClick);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#handlePriceChange);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#handleTypeChange);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#handleDestinationChange);

    this.element
      .querySelector('.event__available-offers')
      ?.addEventListener('change', this.#handleOfferChange);


    if (this.#editPointType === EDIT_TYPE.CREATING) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#handleResetClick);
    }

    if (this.#editPointType === EDIT_TYPE.EDITING) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#handleResetClick);

      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#handleDeleteClick);
    }


    this.#setDatepickers();
  };


  #setDatepickers = () => {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const config = {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true
    };

    if (this._state.dateFrom) {
      this.#datepickerFrom = flatpickr(
        dateFromElement,
        {
          ...config,
          defaultDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          onClose: this.#handleRoutePointDateFromClose,
        },
      );
    }
    else {
      this.#datepickerFrom = flatpickr(
        dateFromElement,
        {
          ...config,
          onClose: this.#handleRoutePointDateFromClose,
        },
      );
    }

    if (this._state.dateTo) {
      this.#datepickerTo = flatpickr(
        dateToElement,
        {
          ...config,
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onClose: this.#handleRoutePointDateToClose,
        },
      );
    }
    else {
      this.#datepickerTo = flatpickr(
        dateToElement,
        {
          ...config,
          onClose: this.#handleRoutePointDateToClose,
        },
      );
    }
  };


  #handleResetClick = (evt) => {
    evt.preventDefault();
    this.#handleEditFormResetClick();
  };

  #handleSubmitClick = (evt) => {
    evt.preventDefault();
    this.#handleEditFormSubmitClick(NewEditFormView.parseStateToPoint(this._state));
  };

  #handleDeleteClick = (evt) => {
    evt.preventDefault();
    this.#handleEditFormDeleteClick(NewEditFormView.parseStateToPoint(this._state));
  };

  #handlePriceChange = (evt) => {
    evt.preventDefault();
    this._setState({
      ...this._state.routePoint,
      basePrice: evt.target.valueAsNumber
    });
  };

  #handleTypeChange = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #handleDestinationChange = (evt) => {
    const currentDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    const currentDestinationId = (currentDestination)
      ? currentDestination.id
      : null;

    this.updateElement({
      destination: currentDestinationId
    });
  };

  #handleOfferChange = () => {
    const selectedOffersId = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map(({id}) => id.split('-').slice(3).join('-'));

    this._setState({
      offers: selectedOffersId
    });
  };

  #handleRoutePointDateFromClose = ([userDate]) => {
    this._setState({
      dateFrom: userDate
    });
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #handleRoutePointDateToClose = ([userDate]) => {
    this._setState({
      dateTo: userDate
    });
    this.#datepickerFrom.set('maxDate', this._state.dateFrom);
  };


  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  reset(routePoint) {
    this.updateElement(
      NewEditFormView.parsePointToState(routePoint)
    );
  }

  get template() {
    return createEditFormTemplate( { //this._state, this.#offersByType, this.#destinations, this.#mode
      state: this._state,
      offersModel: this.#offersModel,
      destinations: this.#destinations,
      editPointType: this.#editPointType,
    });
  }
}
