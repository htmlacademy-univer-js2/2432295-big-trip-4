import { container } from './const.js';
import Presenter from './presenter/presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const pointsModel = new PointsModel();

const presenter = new Presenter({
  container: container,
  pointsModel: pointsModel,
  offerModel: offersModel,
  destinationModel: destinationsModel
});

presenter.init();
