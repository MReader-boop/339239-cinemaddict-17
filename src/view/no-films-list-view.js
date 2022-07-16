import { FilterType } from '../constants/constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const getEmptyFilterText = (currentFilter) => {
  switch (currentFilter) {
    case FilterType.ALL:
      return 'There are no movies in our database';
    case FilterType.WATCHLIST:
      return 'There are no movies to watch now';
    case FilterType.HISTORY:
      return 'There are no watched movies now';
    case FilterType.FAVORITES:
      return 'There are no favorite movies now';
  }
};

const createNoFilmsListTemplate = (currentFilter) =>
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${getEmptyFilterText(currentFilter)}</h2>

    </section>
  </section>`;

export default class NoFilmsListView extends AbstractView {
  #currentFilter = null;

  get template() {
    return createNoFilmsListTemplate(this.#currentFilter);
  }

  constructor(currentFilter){
    super();
    this.#currentFilter = currentFilter;
  }
}
