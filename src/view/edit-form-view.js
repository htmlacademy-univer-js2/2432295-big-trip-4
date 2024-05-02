import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createEditFormTemplate } from '../template/edit-form-template';
import { POINT_EMPTY } from '../const';

export default class NewEditFormView extends AbstractStatefulView {
  constructor({ routePoint = POINT_EMPTY, destinations, offers, onEditFormSubmitClick, onEditFormResetClick }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleEditFormSubmitClick = onEditFormSubmitClick;
    this.#handleEditFormResetClick = onEditFormResetClick;

    this._setState(NewEditFormView.parsePointToState({ routePoint }));
    this._restoreHandlers();
  }

  #destinations = null;
  #offers = null;

  #handleEditFormSubmitClick = null;
  #handleEditFormResetClick = null;


  static parsePointToState = ({ routePoint }) => ({ routePoint });
  static parseStateToPoint = (state) => state.routePoint;


  _restoreHandlers = () => {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#resetClickHandler);

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
      .addEventListener('change', this.#offerChangeHandler);
  };


  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormResetClick();
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormSubmitClick(NewEditFormView.parseStateToPoint(this._state));
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      routePoint: {
        ...this._state.routePoint,
        basePrice: evt.target.value,
      }
    });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      routePoint: {
        ...this._state.routePoint,
        type: evt.target.value,
        offers: [], //
      },
    });
  };

  #destinationChangeHandler = (evt) => {
    const destinationId = this.#destinations.find((destination) => destination.name === evt.target.value).id;
    this.updateElement({
      routePoint: {
        ...this._state.routePoint,
        destination: destinationId,
      }
    });
  };

  #offerChangeHandler = () => {
    const offersId = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map(({ id }) => id.split('-').slice(3).join('-'));

    this._setState({
      routePoint: {
        ...this._state.routePoint,
        offers: offersId
      }
    });
  };


  reset(routePoint) {
    this.updateElement({
      routePoint
    });
  }


  get template() {
    return createEditFormTemplate(this._state.routePoint, this.#destinations, this.#offers);
  }
}
