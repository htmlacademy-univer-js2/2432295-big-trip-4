import { render, RenderPosition } from './framework/render.js';
import Presenter from './presenter/presenter.js';
import PointsModel from './model/PointsModel.js';
import OffersModel from './model/OffersModel.js';
import DestinationsModel from './model/DestinationsModel.js';

import NewTripInfoView from './view/trip-info-view.js';
import NewFiltersView from './view/filters-view.js';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const siteHeaderFilters = headerElement.querySelector('.trip-controls__filters');
const siteBodyTripPointsList = bodyElement.querySelector('.trip-events');
const siteHeaderTripMain = headerElement.querySelector('.trip-main');


const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const presenter = new Presenter({
  container: siteBodyTripPointsList,
  pointsModel,
  offersModel,
  destinationsModel
});

render(new NewTripInfoView(), siteHeaderTripMain, RenderPosition.AFTERBEGIN);
render(new NewFiltersView(), siteHeaderFilters);

presenter.init();
