import { CONTAINER, AUTHORIZATION, END_POINT } from './const.js';

import Presenter from './presenter/presenter.js';
import FilterPresenter from './presenter/filter-presenter';
import CreateRoutePointButtonPresenter from './presenter/create-point-button-presenter';

import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model';

import TripApiService from './service/trip-api-service.js';


const tripApiService = new TripApiService(END_POINT, AUTHORIZATION);

const offersModel = new OffersModel(tripApiService);
const destinationsModel = new DestinationsModel(tripApiService);
const pointsModel = new PointsModel({ tripApiService, destinationsModel, offersModel });
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

const filterPresenter = new FilterPresenter({
  container: CONTAINER.FILTER,
  pointsModel,
  filterModel
});

createRoutePointButtonPresenter.init({ onNewRoutePointButtonClick: presenter.createRoutePointButtonClickHandler });
presenter.init();
filterPresenter.init();

pointsModel.init();
