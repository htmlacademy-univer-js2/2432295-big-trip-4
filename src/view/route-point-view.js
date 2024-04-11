import AbstractView from '../framework/view/abstract-view';
import { createRoutePointTemplate } from '../template/route-point-template';

export default class NewRoutePointView extends AbstractView{
  constructor({routePoint, onEditClick}) {
    super();
    this.#routePoint = routePoint;

    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  #routePoint = null;
  #handleEditClick = null;

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  get template() {
    return createRoutePointTemplate(this.#routePoint);
  }
}
