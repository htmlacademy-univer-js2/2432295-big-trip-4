import { render } from '../render';

import NewSortView from '../view/sort-view.js';
import NewRouteStagesView from '../view/route-stages-list-view.js';
import NewRouteStageView from '../view/route-stage-view.js';
import NewCreateFormView from '../view/create-form-view.js';
import NewEditFormView from '../view/edit-form-view.js';

export default class Presenter {
  constructor({container}) {
    this.container = container;
  }

  routeStagesComponent = new NewRouteStagesView();

  init() {
    render(new NewSortView(), this.container);
    render(this.routeStagesComponent, this.container);

    render(new NewEditFormView(), this.routeStagesComponent.getElement());
    render(new NewCreateFormView(), this.routeStagesComponent.getElement());

    for (let i = 0; i < 3; i++){
      render(new NewRouteStageView(), this.routeStagesComponent.getElement());
    }
  }

}
