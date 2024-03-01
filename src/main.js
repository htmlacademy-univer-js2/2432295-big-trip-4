import {render, RenderPosition} from './render.js';
import Presenter from './presenter/presenter.js';

import NewTripInfoView from './view/trip-info-view.js';
import NewFiltersView from './view/filters-view.js';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');

const siteHeaderFilters = headerElement.querySelector('.trip-controls__filters');
const siteBodyTripStagesList = bodyElement.querySelector('.trip-events');
const siteHeaderTripMain = headerElement.querySelector('.trip-main');

const presenter = new Presenter({
  container: siteBodyTripStagesList
});

render(new NewTripInfoView(), siteHeaderTripMain, RenderPosition.AFTERBEGIN);
render(new NewFiltersView(), siteHeaderFilters);

presenter.init();
