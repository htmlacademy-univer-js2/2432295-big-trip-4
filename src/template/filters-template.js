export function createFiltersTemplate(filters, currentFilterType) {
  return (
    `<form class="trip-filters" action="#" method="get">
        ${createFiltersButtons(filters, currentFilterType)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
}

function createFiltersButtons(filters, currentFilterType) { //
  return filters.map((filter) => (`<div class="trip-filters__filter">
    <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}" ${currentFilterType === filter.type ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.type}</label>
  </div>`)).join('');
}
