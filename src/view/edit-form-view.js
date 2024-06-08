import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createEditFormTemplate } from '../template/edit-form-template';
import { POINT_EMPTY, MODE } from '../const';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


export default class EditFormView extends AbstractStatefulView {
  constructor({ routePoint = POINT_EMPTY, destinations, offersModel,
    onEditFormSubmitClick, onEditFormResetClick, onEditFormDeleteClick,
    editPointMode = MODE.EDITING }) {
    super();
    this.#destinations = destinations;
    this.#offersModel = offersModel;

    this.#handleEditFormSubmitClick = onEditFormSubmitClick;
    this.#handleEditFormResetClick = onEditFormResetClick;
    this.#handleEditFormDeleteClick = onEditFormDeleteClick;

    this.#editPointMode = editPointMode;

    this._setState(EditFormView.parsePointToState(routePoint));
    this._restoreHandlers();
  }

  #destinations = null;
  #offersModel = null;

  #handleEditFormSubmitClick = null;
  #handleEditFormResetClick = null;
  #handleEditFormDeleteClick = null;

  #editPointMode = null;

  #datepickerFrom = null;
  #datepickerTo = null;


  static parsePointToState(routePoint) {
    return {
      ...routePoint,
      isActive: true,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const routePoint = { ...state };
    delete routePoint.isActive;
    delete routePoint.isSaving;
    delete routePoint.isDeleting;
    return routePoint;
  }


  _restoreHandlers = () => {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#submitClickHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element
      .querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerChangeHandler);


    if (this.#editPointMode === MODE.CREATING) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#resetClickHandler);
    }

    if (this.#editPointMode === MODE.EDITING) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#resetClickHandler);

      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#deleteClickHandler);
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
          onClose: this.#routePointDateFromCloseHandler,
        },
      );
    }
    else {
      this.#datepickerFrom = flatpickr(
        dateFromElement,
        {
          ...config,
          onClose: this.#routePointDateFromCloseHandler,
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
          onClose: this.#routePointDateToCloseHandler,
        },
      );
    }
    else {
      this.#datepickerTo = flatpickr(
        dateToElement,
        {
          ...config,
          onClose: this.#routePointDateToCloseHandler,
        },
      );
    }
  };


  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormResetClick();
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormSubmitClick(EditFormView.parseStateToPoint(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormDeleteClick(EditFormView.parseStateToPoint(this._state));
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      ...this._state.routePoint,
      basePrice: evt.target.valueAsNumber
    });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    const currentDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    const currentDestinationId = (currentDestination) ? currentDestination.id : null;

    this.updateElement({
      destination: currentDestinationId
    });
  };

  #offerChangeHandler = () => {
    const selectedOffersId = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map(({ id }) => id.split('-').slice(3).join('-'));

    this._setState({
      offers: selectedOffersId
    });
  };

  #routePointDateFromCloseHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate
    });
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #routePointDateToCloseHandler = ([userDate]) => {
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
      EditFormView.parsePointToState(routePoint)
    );
  }

  get template() {
    return createEditFormTemplate({
      state: this._state,
      offersModel: this.#offersModel,
      destinations: this.#destinations,
      editPointMode: this.#editPointMode,
    });
  }
}
