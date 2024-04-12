import AbstractView from '../framework/view/abstract-view';
import { createFormTemplate } from '../template/create-form-template';

export default class NewCreateFormView extends AbstractView{
  get template() {
    return createFormTemplate();
  }
}
