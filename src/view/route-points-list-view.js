import AbstractView from '../framework/view/abstract-view';
import { createRoutePointsListTemplate } from '../template/create-route-points-list-template';


export default class RoutePointsListView extends AbstractView{
  constructor() {
    super();
  }

  get template() {
    return createRoutePointsListTemplate();
  }
}
