import AbstractView from '../framework/view/abstract-view';
import { createFiltersTemplate } from '../template/filters-template';

export default class NewFiltersView extends AbstractView{
  get template() {
    return createFiltersTemplate();
  }
}
