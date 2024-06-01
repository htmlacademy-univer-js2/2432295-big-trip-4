import { RenderPosition, render } from './framework/render';
import { CONTAINER } from './const.js';

import Presenter from './presenter/presenter.js';
import FilterPresenter from './presenter/filter-presenter';
import CreateRoutePointButtonPresenter from './presenter/create-point-button-presenter';

import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model';

import TripInfoView from './view/trip-info-view';

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const createRoutePointButtonPresenter = new CreateRoutePointButtonPresenter({
  container: CONTAINER.TRIP_INFO,
});
const presenter = new Presenter({
  container: CONTAINER,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  createRoutePointButtonPresenter
});
const filterPresenter = new FilterPresenter({ //
  container: CONTAINER.FILTER,
  pointsModel,
  filterModel
});

presenter.init();
createRoutePointButtonPresenter.init({ onNewPointButtonClick: presenter.createRoutePointButtonClickHandler });
filterPresenter.init();

render(new TripInfoView(pointsModel.points, destinationsModel), CONTAINER.TRIP_INFO, RenderPosition.AFTERBEGIN);
