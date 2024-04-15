import { render, replace, RenderPosition } from '../framework/render.js';
import { SITE_HEADER_FILTERS, SITE_HEADER_TRIP_MAIN } from '../const';

import NewSortView from '../view/sort-view.js';
import NewFiltersView from '../view/filters-view';
import NewRoutePointsView from '../view/route-points-list-view.js';
import NewRoutePointView from '../view/route-point-view.js';
import NewEditFormView from '../view/edit-form-view.js';
import NewTripInfoView from '../view/trip-info-view';

export default class Presenter {
  constructor({ container, pointsModel, offersModel, destinationsModel }) {
    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #filterViewComponent = null;
  #routePointsComponent = null;
  #sortViewComponent = null;

  #routePoints = [];
  #filteredRoutePoints = [];


  init() {
    this.#routePoints = [...this.#pointsModel.routePoints];

    render(new NewTripInfoView(), SITE_HEADER_TRIP_MAIN, RenderPosition.AFTERBEGIN);

    this.#renderFilter();
    this.#renderSort();
    this.#renderRoutePointList();
  }

  #renderFilter() {
    this.#filterViewComponent = new NewFiltersView({
      routePoints: this.#routePoints,
      onFilterChange: () => {
        this.#filterViewComponent.currentFilter.filter(this.#routePoints);
        /*this.#filteredRoutePoints = this.#filterViewComponent.currentFilter.filter(this.#routePoints);
        this.#renderRoutePointList();*/
      }
    });

    this.#filteredRoutePoints = this.#filterViewComponent.currentFilter.filter(this.#routePoints);

    render(this.#filterViewComponent, SITE_HEADER_FILTERS);
  }

  #renderSort() {
    this.#sortViewComponent = new NewSortView({
      onSortChange: () => {
        this.#routePoints.sort(this.#sortViewComponent.currentSort);
      }
    });

    render(this.#sortViewComponent, this.#container);
    this.#filteredRoutePoints.sort(this.#sortViewComponent.currentSort);
  }

  #renderRoutePointList() {
    this.#routePointsComponent = new NewRoutePointsView(this.#filteredRoutePoints,
      this.#filterViewComponent.currentFilter.name);

    render(this.#routePointsComponent, this.#container);

    for (let i = 0; i < this.#filteredRoutePoints.length; i++) {
      this.#renderRoutePoint(this.#filteredRoutePoints[i]);
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
        document.addEventListener('keydown', escKeyHandler);
      }
    });

    const editRoutePointComponent = new NewEditFormView({
      routePoint: routePoint,
      destination: this.#destinationsModel.getDestinationById(routePoint.id),
      offers: this.#offersModel.getOffersByType(routePoint.type),
      allDestinations: this.#destinationsModel.allDestinations,

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
