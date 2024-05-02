import { render, replace, remove } from '../framework/render';
import { MODE } from '../const';

import NewRoutePointView from '../view/route-point-view.js';
import NewEditFormView from '../view/edit-form-view.js';

export default class RoutePointPresenter {
  constructor({ routePointListcontainer, offersModel, destinationsModel, onDataChange, onModeChange }) {

    this.#routePointListcontainer = routePointListcontainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  #routePointListcontainer = null;
  #routePoint = null;

  #currentMode = MODE.DEFAULT;

  #offersModel = null;
  #destinationsModel = null;

  #routePointComponent = null;
  #editRoutePointComponent = null;

  #handleDataChange = null;
  #handleModeChange = null;

  init(routePoint) {
    this.#routePoint = routePoint;

    const prevPointComponent = this.#routePointComponent;
    const prevEditFormComponent = this.#editRoutePointComponent;

    this.#routePointComponent = new NewRoutePointView({
      routePoint: this.#routePoint,
      offers: this.#offersModel.getOffersByType(this.#routePoint.type),
      destination: this.#destinationsModel.getDestinationById(this.#routePoint.destination),

      onEditClick: this.#onEditFormClick,
      onFavoriteClick: this.#onFavoriteClick
    });

    this.#editRoutePointComponent = new NewEditFormView({
      routePoint: this.#routePoint,
      offers: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations,

      onEditFormResetClick: this.#onEditFormReset,
      onEditFormSubmitClick: this.#onEditFormSubmit
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#routePointComponent, this.#routePointListcontainer);
      return;
    }

    switch (this.#currentMode) {
      case MODE.DEFAULT:
        replace(this.#routePointComponent, prevPointComponent);
        break;
      case MODE.EDITING:
        replace(this.#editRoutePointComponent, prevEditFormComponent);
        break;
      default:
        break;
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  #onFavoriteClick = () => {
    this.#handleDataChange({ ...this.#routePoint, isFavorite: !this.#routePoint.isFavorite });
  };

  #onEditFormClick = () => {
    this.#replacePointToForm();
  };

  #onEditFormSubmit = (updatePoint) => {
    this.#routePoint = updatePoint;
    this.#replaceEditToPoint();
    document.removeEventListener('keydown', this.#escKeyHandler);
  };

  #onEditFormReset = () => {
    this.#editRoutePointComponent.reset(this.#routePoint);

    this.#replaceEditToPoint();
    document.removeEventListener('keydown', this.#escKeyHandler);
  };


  #replacePointToForm = () => {
    replace(this.#editRoutePointComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escKeyHandler);

    this.#handleModeChange();
    this.#currentMode = MODE.EDITING;
  };

  #replaceEditToPoint = () => {
    replace(this.#routePointComponent, this.#editRoutePointComponent);
    document.removeEventListener('keydown', this.#escKeyHandler);

    this.#currentMode = MODE.DEFAULT;
  };

  #escKeyHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editRoutePointComponent.reset(this.#routePoint);

      this.#replaceEditToPoint();
    }
  };


  initialStateView() {
    if (this.#currentMode === MODE.EDITING) {
      this.#editRoutePointComponent.reset(this.#routePoint);

      this.#replaceEditToPoint();
    }
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#editRoutePointComponent);
  }
}
