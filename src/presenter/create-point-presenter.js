import { RenderPosition, render, remove } from '../framework/render';
import { USER_ACTION, UPDATE_TYPE, EDIT_TYPE } from '../const';
import NewEditFormView from '../view/edit-form-view';

export default class CreateRoutePointPresenter {
  #container = null;
  #createRoutePointComponent = null;

  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleDestroy = null;

  constructor ({container, destinationsModel, offersModel, onDataChange, onDestroy}) {
    this.#container = container;

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init = () => {
    if (!this.#createRoutePointComponent) {
      this.#createRoutePointComponent = new NewEditFormView({
        offersModel: this.#offersModel,
        destinations: this.#destinationsModel.destinations,
        onEditFormResetClick: this.#handleFormClose,
        onEditFormSubmitClick : this.#handleEditFormSubmit,
        editPointType: EDIT_TYPE.CREATING,
      });
    }

    render(this.#createRoutePointComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#handleEscKeyDown);

  };


  #handleFormClose = () => {
    this.destroy();
  };

  #handleEditFormSubmit = (routePoint) => {
    if (routePoint.destination !== null && routePoint.basePrice > 0) {
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
