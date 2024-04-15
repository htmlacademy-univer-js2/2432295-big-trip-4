import {SORT_OPTIONS, DEFAULT_SORT} from '../const';

function createSortItems() {
  return Object.keys(SORT_OPTIONS).map((sortName) =>
    `<div class="trip-sort__item  trip-sort__item--${sortName.toLowerCase()}">
        <input id="sort-${sortName.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortName.toLowerCase()}" ${DEFAULT_SORT === SORT_OPTIONS[sortName] ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${sortName.toLowerCase()}">${sortName.charAt(0).toUpperCase() + sortName.slice(1)}</label>
     </div>`).join('');
}

export function createSortTemplate() {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createSortItems()}
    </form>`
  );
}
