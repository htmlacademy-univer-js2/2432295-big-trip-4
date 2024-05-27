import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createEditFormTemplate } from '../template/edit-form-template';
import { POINT_EMPTY, EDIT_TYPE } from '../const'; //

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


export default class NewEditFormView extends AbstractStatefulView {
  constructor({ routePoint = POINT_EMPTY(), destinations, offers,
    onEditFormSubmitClick, onEditFormResetClick, onEditFormDeleteClick,
    editFormType = EDIT_TYPE.EDITING }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleEditFormSubmitClick = onEditFormSubmitClick;
    this.#handleEditFormResetClick = onEditFormResetClick;
    this.#handleEditFormDeleteClick = onEditFormDeleteClick;

    this.#editFormType = editFormType;

    this._setState({ routePoint });
    this._restoreHandlers();
  }

  #destinations = null;
  #offers = null;

  #handleEditFormSubmitClick = null;
  #handleEditFormResetClick = null;
  #handleEditFormDeleteClick = null; //

  #editFormType = null;

  #datepickerFrom = null;
  #datepickerTo = null;


  static parsePointToState = ({ routePoint }) => ({ routePoint });
  static parseStateToPoint = (state) => state.routePoint;


  _restoreHandlers = () => {
    if (this.#editFormType === EDIT_TYPE.EDITING) { //
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#resetClickHandler);

      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#deleteClickHandler);
    }

    if (this.#editFormType === EDIT_TYPE.CREATING) { //
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#resetClickHandler);
    }

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

    this.#setDatepickers();
  };


  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormResetClick();
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormSubmitClick(NewEditFormView.parseStateToPoint(this._state));
  };

  #deleteClickHandler = (evt) => { //
    evt.preventDefault();
    this.#handleEditFormDeleteClick(NewEditFormView.parseStateToPoint(this._state));
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      routePoint: {
        ...this._state.routePoint,
        basePrice: evt.target.valueAsNumber,
      }
    });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      routePoint: {
        ...this._state.routePoint,
        type: evt.target.value,
        offers: []
      },
    });
  };

  #destinationChangeHandler = (evt) => { //
    let currentDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    currentDestination = currentDestination === undefined ? undefined : currentDestination.id;

    this.updateElement({
      routePoint: {
        ...this._state.routePoint,
        destination: currentDestination,
      }
    });
  };

  #offerChangeHandler = () => {
    const offersId = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map((checkbox) => checkbox.dataset.offerId);


    this._setState({
      routePoint: {
        ...this._state.routePoint,
        offers: offersId
      }
    });
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

    if (this._state.routePoint.dateFrom) {
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

    if (this._state.routePoint.dateTo) {
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
  };


  #routePointDateFromCloseHandler = ([userDate]) => {
    this._setState({
      routePoint:{
        ...this._state.routePoint,
        dateFrom: userDate
      }
    });
    this.#datepickerTo.set('minDate', this._state.routePoint.dateFrom);
  };

  #routePointDateToCloseHandler = ([userDate]) => {
    this._setState({
      routePoint:{
        ...this._state.routePoint,
        dateFrom: userDate
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.routePoint.dateFrom);
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
    this.updateElement({
      routePoint
    });
  }

  get template() {
    return createEditFormTemplate({ //
      routePoint: this._state.routePoint,
      offers: this.#offers,
      destinations: this.#destinations,
      editPointType: this.#editFormType,
    });
  }
}
