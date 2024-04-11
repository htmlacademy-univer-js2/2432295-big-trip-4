import AbstractView from '../framework/view/abstract-view';
import { createSortTemplate } from '../template/sort-template';

export default class NewSortView extends AbstractView{
  get template(){
    return createSortTemplate();
  }
}
