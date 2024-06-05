import { render, replace, remove } from '../framework/render';
import { MODE, UPDATE_TYPE, USER_ACTION, EDIT_TYPE } from '../const'; // caps
import { isMinorUpdate } from '../utils';

import NewRoutePointView from '../view/route-point-view.js';
import NewEditFormView from '../view/edit-form-view.js';

export default class RoutePointPresenter {
  constructor({ container, offersModel, destinationsModel, onDataChange, onModeChange }) {

    this.#container = container;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  #container = null;
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
      offersModel: this.#offersModel,
      destinations: this.#destinationsModel.destinations,

      onEditFormResetClick: this.#onEditFormReset,
      onEditFormSubmitClick: this.#onEditFormSubmit,
      onEditFormDeleteClick: this.#onEditFormDelete, //

      editPointType: EDIT_TYPE.EDITING, //
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#routePointComponent, this.#container);
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
    prevEditFormComponent.removeElement();
  }


  #onEditFormClick = () => {
    this.#replacePointToForm();
  };

  #onFavoriteClick = () => {
    this.#handleDataChange(
      USER_ACTION.UPDATE_POINT, //
      UPDATE_TYPE.MINOR, //
      {
        ...this.#routePoint,
        isFavorite: !this.#routePoint.isFavorite,
      });
  };

  #onEditFormSubmit = (updatePoint) => {
    this.#handleDataChange(
      USER_ACTION.UPDATE_POINT,
      isMinorUpdate(updatePoint, this.#routePoint) ? UPDATE_TYPE.MINOR : UPDATE_TYPE.PATCH,
      updatePoint
    );
    if (this.#editRoutePointComponent._state.isActive) {
      this.#replaceEditToPoint();
    }
  };

  #onEditFormReset = () => {
    this.#editRoutePointComponent.reset(this.#routePoint);

    this.#replaceEditToPoint();
    document.removeEventListener('keydown', this.#escKeyHandler);
  };

  #onEditFormDelete = (routePoint) => { // handleDeleteClick
    this.#handleDataChange(
      USER_ACTION.DELETE_POINT,
      UPDATE_TYPE.MINOR,
      routePoint
    );
  };


  #replacePointToForm = () => {
    replace(this.#editRoutePointComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escKeyHandler);

    this.#handleModeChange();
    this.#currentMode = MODE.EDITING;
  };

  #replaceEditToPoint = () => {
    this.#currentMode = MODE.DEFAULT;

    if (this.#editRoutePointComponent._state.isActive) {
      this.#editRoutePointComponent.reset(this.#routePoint);
      replace(this.#routePointComponent, this.#editRoutePointComponent);
      document.removeEventListener('keydown', this.#escKeyHandler);
      this.#currentMode = MODE.DEFAULT;
    }
  };

  #escKeyHandler = (evt) => {
    if ((evt.key === 'Escape' || evt.key === 'Esc') && this.#editRoutePointComponent._state.isActive) {
      evt.preventDefault();
      this.#editRoutePointComponent.reset(this.#routePoint);

      this.#replaceEditToPoint();
    }
  };


  initialStateView() {
    if (this.#currentMode !== MODE.DEFAULT) {
      this.#editRoutePointComponent.reset(this.#routePoint);

      this.#replaceEditToPoint();
    }
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#editRoutePointComponent);
    this.#editRoutePointComponent.removeElement();
  }


  setSaving() {
    if (this.#currentMode === MODE.EDITING) {
      this.#editRoutePointComponent.updateElement({
        isActive: false,
        isSaving: true
      });
    }
  }

  setDeleting() {
    this.#editRoutePointComponent.updateElement({
      isActive: false,
      isDeleting: true
    });
  }

  setAborting() {
    if (this.#currentMode === MODE.EDITING) {
      const resetFormState = () => {
        this.#editRoutePointComponent.updateElement({
          isActive: true,
          isSaving: false,
          isDeleting: false
        });
      };
      this.#editRoutePointComponent.shake(resetFormState);
    } else {
      this.#editRoutePointComponent.shake();
    }
  }
}
