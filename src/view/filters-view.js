import { FilterType } from '../constants/constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const getFilterName = (type) => {
  switch (type) {
    case FilterType.ALL:
      return 'All movies';
    case FilterType.WATCHLIST:
      return 'Watchlist';
    case FilterType.HISTORY:
      return 'History';
    case FilterType.FAVORITES:
      return 'Favorites';
  }
};

const createFilterTemplate = (filter, currentFilter) => {
  const {type, name, count} = filter;
  return (`
    <a href="#${name}" class="main-navigation__item ${name === currentFilter ? 'main-navigation__item--active' : ''}">
    ${getFilterName(type)}
    ${name !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>`
  );
};

const createFiltersTemplate = (filters, currentFilter) => `
    <nav class="main-navigation">${filters.map((filter) => createFilterTemplate(filter, currentFilter)).join('')}</nav>`;

{/*
<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
<a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">0</span></a>
<a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">0</span></a>
<a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">0</span></a>
*/}

export default class FiltersView extends AbstractView {

  #films = null;
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }
}
