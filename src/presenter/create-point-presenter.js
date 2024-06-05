import { RenderPosition, render, remove } from '../framework/render';
import { USER_ACTION, UPDATE_TYPE, MODE } from '../const';
import NewEditFormView from '../view/edit-form-view';

export default class CreateRoutePointPresenter {
  #container = null;
  #createRoutePointComponent = null;

  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #mode = null;

  constructor ({container, destinationsModel, offersModel, onDataChange, onDestroy}) {
    this.#container = container;

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#mode = MODE.CREATING;

    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (!this.#createRoutePointComponent) {
      this.#createRoutePointComponent = new NewEditFormView({
        offersModel: this.#offersModel,
        destinations: this.#destinationsModel.destinations,
        editPointType: MODE.CREATING,

        onEditFormResetClick: this.#handleFormClose,
        onEditFormSubmitClick : this.#handleEditFormSubmit
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

  setAborting () {
    const resetFormState = () => {
      this.#createRoutePointComponent.updateElement({
        isActive: true,
        isSaving: false,
        isDeleting: false
      });
    };
    this.#createRoutePointComponent.shake(resetFormState);
  }


  #handleFormClose = () => {
    //this.#addPointButton.disabled = false;
    this.destroy();
  };

  #handleEditFormSubmit = (routePoint) => {
    if (routePoint.destination !== null && routePoint.basePrice > 0) {
      //this.#addPointButton.disabled = false;

      this.#handleDataChange(
        USER_ACTION.ADD_POINT,
        UPDATE_TYPE.MINOR,
        routePoint
      );

      this.destroy({ isCanceled: false });
    }
  };

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };


  destroy = ({isCanceled = true} = {}) => {
    if (!this.#createRoutePointComponent) {
      return;
    }

    remove(this.#createRoutePointComponent);
    this.#createRoutePointComponent = null;
    document.removeEventListener('keydown', this.#handleEscKeyDown);

    this.#handleDestroy({isCanceled});
  };
}
