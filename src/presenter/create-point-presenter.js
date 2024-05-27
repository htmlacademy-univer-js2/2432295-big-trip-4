import { RenderPosition, render, remove } from '../framework/render';
import { USER_ACTION, UPDATE_TYPE, EDIT_TYPE } from '../const';
import NewEditFormView from '../view/edit-form-view';

export default class CreatePointPresenter { //all
  #container = null;
  #createPointComponent = null;

  #destinationModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleDestroy = null;

  constructor ({container, destinationModel, offersModel, onDataChange, onDestroy}) {
    this.#container = container;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init = () => { //
    if (!this.#createPointComponent) {
      this.#createPointComponent = new NewEditFormView({
        offers: this.#offersModel.offers,
        destinations: this.#destinationModel.destinations,
        onEditFormResetClick: this.#handleFormClose,
        onEditFormSubmitClick : this.#handleEditFormSubmit,
        editFormType: EDIT_TYPE.CREATING,
      });
    }

    render(this.#createPointComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);

  };

  destroy = ({isCanceled = true} = {}) => {
    if (!this.#createPointComponent) {
      return;
    }

    remove(this.#createPointComponent);
    this.#createPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#handleDestroy({isCanceled});
  };

  #handleEditFormSubmit = (routePoint) => {
    if (routePoint.destination !== null) {
      this.#handleDataChange(
        USER_ACTION.ADD_POINT,
        UPDATE_TYPE.MINOR,
        routePoint
      );

      this.destroy({ isCanceled: false });
    }
  };

  #handleFormClose = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
