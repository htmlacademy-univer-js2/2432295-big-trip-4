import { render } from '../render';

import NewSortView from '../view/sort-view.js';
import NewRoutePointsView from '../view/route-points-list-view.js';
import NewRoutePointView from '../view/route-point-view.js';
import NewEditFormView from '../view/edit-form-view.js';

export default class Presenter {
  constructor({container, model}) {
    this.container = container;
    this.model = model;
  }

  routePointsComponent = new NewRoutePointsView();

  init() {
    this.routePoints = [...this.model.getRoutePoints()];

    render(new NewSortView(), this.container);
    render(this.routePointsComponent, this.container);

    render(new NewEditFormView({routePoint: this.routePoints[0]}), this.routePointsComponent.getElement());

    for(let i = 1; i < this.routePoints.length; i++) {
      render(new NewRoutePointView({routePoint: this.routePoints[i]}), this.routePointsComponent.getElement());
    }
  }

}
