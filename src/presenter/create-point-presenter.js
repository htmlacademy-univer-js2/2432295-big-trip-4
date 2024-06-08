import { RenderPosition, render, remove } from '../framework/render';
import { USER_ACTION, UPDATE_TYPE, MODE } from '../const';
import EditFormView from '../view/edit-form-view';

export default class CreateRoutePointPresenter {
  #container = null;
  #createRoutePointComponent = null;

  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #createRoutePointButton = null;

  constructor({ container, destinationsModel, offersModel, createRoutePointButton, onDataChange, onDestroy }) {
    this.#container = container;

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#createRoutePointButton = createRoutePointButton;

    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }


  init() {
    if (!this.#createRoutePointComponent) {
      this.#createRoutePointComponent = new EditFormView({
        offersModel: this.#offersModel,
        destinations: this.#destinationsModel.destinations,
        editPointMode: MODE.CREATING,

        onEditFormResetClick: this.#handleEditFormClose,
        onEditFormSubmitClick: this.#handleEditFormSubmit
      });
    }

    render(this.#createRoutePointComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#handleEscKeyDown);
  }


  setSaving() {
    this.#createRoutePointComponent.updateElement({
      isActive: false,
      isSaving: true
    });
  }

  setAborting() {
    const resetEditFormState = () => {
      this.#createRoutePointComponent.updateElement({
        isActive: true,
        isSaving: false,
        isDeleting: false
      });
    };
    this.#createRoutePointComponent.shake(resetEditFormState);
  }


  #handleEditFormClose = () => {
    this.#createRoutePointButton.disableButton();
    this.destroy();
  };

  #handleEditFormSubmit = (routePoint) => {
    if (routePoint.destination !== null) {
      this.#createRoutePointButton.disableButton();

      this.#handleDataChange(
        USER_ACTION.ADD_POINT,
        UPDATE_TYPE.MINOR,
        routePoint
      );
    }
  };

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };


  destroy = ({ isCanceled = true } = {}) => {
    if (!this.#createRoutePointComponent) {
      return;
    }

    remove(this.#createRoutePointComponent);
    this.#createRoutePointComponent = null;
    document.removeEventListener('keydown', this.#handleEscKeyDown);

    this.#handleDestroy({ isCanceled });
  };
}
