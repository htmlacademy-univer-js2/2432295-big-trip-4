import { render, replace } from '../framework/render.js';

import NewSortView from '../view/sort-view.js';
import NewRoutePointsView from '../view/route-points-list-view.js';
import NewRoutePointView from '../view/route-point-view.js';
import NewEditFormView from '../view/edit-form-view.js';
// import FilterView from '../view/filter-view.js';
// import TripInfoView from '../view/trip-info-view.js';


export default class Presenter {
  constructor({ container, pointsModel, offersModel, destinationsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  #routePoints = [];

  #routePointsComponent = new NewRoutePointsView();
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  init() {
    this.#routePoints = [...this.#pointsModel.routePoints];

    this.#renderRoutePointList();
  }

  #renderRoutePointList() {
    render(new NewSortView(), this.#container);
    // render(new FilterView(), this.#container.filter);
    // render(new TripInfoView({points: this.#tripPoints}), this.#container.tripInfo, RenderPosition.AFTERBEGIN);

    render(this.#routePointsComponent, this.#container);

    for (let i = 0; i < this.#routePoints.length; i++) {
      this.#renderRoutePoint(this.#routePoints[i]);
    }
  }

  #renderRoutePoint(routePoint) {
    const escKeyHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToForm();
        document.removeEventListener('keydown', escKeyHandler);
      }
    };

    const routePointComponent = new NewRoutePointView({
      routePoint: routePoint,
      destination: this.#destinationsModel.getDestinationById(routePoint.id),
      offers: this.#offersModel.getOffersByType(routePoint.type),

      onEditClick: () => {
        replacePointToForm();
        document.removeEventListener('keydown', escKeyHandler);
      }
    });

    const editRoutePointComponent = new NewEditFormView({
      routePoint: routePoint,
      destination: this.#destinationsModel.getDestinationById(routePoint.id),
      offers: this.#offersModel.getOffersByType(routePoint.type),

      onSubmitClick: () => {
        replaceEditToForm();
        document.removeEventListener('keydown', escKeyHandler);
      },
      onRollUpClick: () => {
        replaceEditToForm();
        document.removeEventListener('keydown', escKeyHandler);
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
