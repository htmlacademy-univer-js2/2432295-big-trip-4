import AbstractView from '../framework/view/abstract-view';
import { createTripInfoTemplate } from '../template/trip-info-template';

export default class NewTripInfoView extends AbstractView{
  get template(){
    return createTripInfoTemplate();
  }
}
