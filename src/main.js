//import { RenderPosition, render } from './framework/render';
import { CONTAINER } from './const.js';

import Presenter from './presenter/presenter.js';
import FilterPresenter from './presenter/filter-presenter';
import CreateRoutePointButtonPresenter from './presenter/create-point-button-presenter';

import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model';

//import NewTripInfoView from './view/trip-info-view';

import PointsApiService from './trip-api-service.js';

const AUTHORIZATION = 'Basic cm9vdDpyb290'; // const
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip'; // const

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const offersModel = new OffersModel(pointsApiService);
const destinationsModel = new DestinationsModel(pointsApiService);
const pointsModel = new PointsModel({ pointsApiService, destinationsModel, offersModel });
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

pointsModel.init();

//render(new NewTripInfoView(pointsModel.points, destinationsModel), CONTAINER.TRIP_INFO, RenderPosition.AFTERBEGIN);
