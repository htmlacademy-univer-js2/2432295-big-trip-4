import ApiService from '../framework/api-service';
import { API_METHODS } from '../const';


export default class TripApiService extends ApiService {
  get points() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }


  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: API_METHODS.PUT,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: API_METHODS.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  async deletePoint(pointId) {
    await this._load({
      url: `points/${pointId}`,
      method: API_METHODS.DELETE,
    });
  }
}
