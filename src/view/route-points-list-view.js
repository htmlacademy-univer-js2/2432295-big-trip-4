import AbstractView from '../framework/view/abstract-view';
import { createRoutePointsListTemplate } from '../template/route-points-list-template';


export default class NewRoutePointsView extends AbstractView{
  constructor() {
    super();
  }

  get template() {
    return createRoutePointsListTemplate();
  }
}
