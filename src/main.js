import { SITE_BODY_TRIP_POINTS_LIST } from './const.js';
import Presenter from './presenter/presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const presenter = new Presenter({
  container: SITE_BODY_TRIP_POINTS_LIST,
  pointsModel,
  offersModel,
  destinationsModel
});

presenter.init();
