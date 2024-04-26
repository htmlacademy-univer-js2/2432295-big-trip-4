import AbstractView from '../framework/view/abstract-view';
import { createRoutePointsListTemplate } from '../template/route-points-list-template';
import { createNoRoutePointsTemplate } from '../template/no-route-points-template';
import { FILTER_TYPE } from '../const';


export default class NewRoutePointsView extends AbstractView{
  constructor(routePoints, currentFilterName = FILTER_TYPE.EVERYTHING) {
    super();
    this.#routePoints = routePoints;
    this.#currentFilterName = currentFilterName;
  }

  #routePoints;
  #currentFilterName;

  get template() {
    if (this.#routePoints.length > 0){
      return createRoutePointsListTemplate();
    }else{
      return createNoRoutePointsTemplate(this.#currentFilterName);
    }
  }
}
