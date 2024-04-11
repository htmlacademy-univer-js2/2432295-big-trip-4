import {render, replace} from '../framework/render.js';

import NewSortView from '../view/sort-view.js';
import NewRoutePointsView from '../view/route-points-list-view.js';
import NewRoutePointView from '../view/route-point-view.js';
import NewEditFormView from '../view/edit-form-view.js';

export default class Presenter {
  constructor({container, model}) {
    this.#container = container;
    this.#model = model;
  }

  #routePoints = [];

  #routePointsComponent = new NewRoutePointsView();
  #container = null;
  #model = null;

  init() {
    this.#routePoints = [...this.#model.routePoints];

    this.#renderRoutePointList();
  }

  #renderRoutePointList() {
    render(new NewSortView(), this.#container);
    render(this.#routePointsComponent, this.#container);

    for(let i = 0; i < this.#routePoints.length; i++) {
      this.#renderRoutePoint(this.#routePoints[i]);
    }
  }

  #renderRoutePoint(routePoint) {
    const escKeyHandler = (evt) => {
      if (evt.key === 'Escape') {
        replaceEditToForm();
        document.removeEventListener('keydown', escKeyHandler);
      }
    };

    const routePointComponent = new NewRoutePointView({
      routePoint: routePoint,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyHandler);
      }
    });

    const editRoutePointComponent = new NewEditFormView({routePoint: routePoint,
      onSubmitClick: () => {
        replaceEditToForm();
        document.addEventListener('keydown', escKeyHandler);
      },
      onRollUpClick: () => {
        replaceEditToForm();
        document.addEventListener('keydown', escKeyHandler);
      }
    });

    function replacePointToForm() {
      replace(editRoutePointComponent, routePointComponent);
    }

    function replaceEditToForm() {
      replace(routePointComponent, editRoutePointComponent);
    }

    render(routePointComponent, this.#routePointsComponent.element);
  }
}
