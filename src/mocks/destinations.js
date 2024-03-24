import {getRandomArrayElement} from '../utils';
import {CITIES, DESCRIPTION, PHOTO_ADDRESS} from '../const';

function getRandomDestination() {
  const city = getRandomArrayElement(CITIES);
  return {
    id: crypto.randomUUID(),
    description: DESCRIPTION,
    name: city,
    pictures: Array.from({length: Math.floor(Math.random() * 4) + 1}, () => ({
      src: PHOTO_ADDRESS + crypto.randomUUID(),
      description: `${city} description`
    }))
  };
}

export {getRandomDestination};
