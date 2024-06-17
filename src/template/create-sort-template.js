function createSortItems({ sorts }) {
  return sorts.map(({ type, isDisabled, isChecked }) => `
      <div class="trip-sort__item  trip-sort__item--${type}">
        <input
        id="sort-${type}"
        value="sort-${type}"
        data-sort-type="${type}"
        class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
        ${isDisabled ? 'disabled' : ''}
        ${isChecked ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${type}">${type}</label>
      </div>
    `).join('');
}

export function createSortTemplate({ sorts }) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${createSortItems({ sorts })}
    </form>`
  );
}
