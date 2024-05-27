import { RenderPosition, render } from './framework/render';

import { container } from './const.js';

import Presenter from './presenter/presenter.js';
import FilterPresenter from './presenter/filter-presenter';
import CreatePointButtonPresenter from './presenter/create-point-button-presenter';

import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model';
import DestinationsModel from './model/destinations-model.js';

import TripInfoView from './view/trip-info-view';

const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const pointsModel = new PointsModel();
const filterModel = new FilterModel(); //

const createPointButtonPresenter = new CreatePointButtonPresenter({ //
  container: container.tripInfo,
});
const presenter = new Presenter({
  container,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  createPointButtonPresenter
});
const filterPresenter = new FilterPresenter({ //
  container: container.filter,
  pointsModel,
  filterModel
});

render(new TripInfoView(pointsModel.points, destinationsModel), container.tripInfo, RenderPosition.AFTERBEGIN);

createPointButtonPresenter.init({ //
  onClick: presenter.createPointButtonClickHandler,
});
presenter.init();
filterPresenter.init(); //
