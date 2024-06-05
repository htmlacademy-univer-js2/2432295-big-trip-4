/*import { CITIES, DESCRIPTION, PHOTO_ADDRESS } from '../const';

function getRandomDestination(destination, id) {
  return {
    id: id,
    description: DESCRIPTION,
    name: destination,
    pictures: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => ({
      src: PHOTO_ADDRESS + crypto.randomUUID(),
      description: `${destination} description`
    }))
  };
}

const generateDestinations = () => CITIES.map((city, id) => getRandomDestination(city, id));

const getAllDestinations = () => CITIES;

export { generateDestinations, getAllDestinations };*/
