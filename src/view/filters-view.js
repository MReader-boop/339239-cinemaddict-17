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

  setAllFilterClickHandler = (callback) => {
    this._callback.allFilterClick = callback;
    this.element.querySelector('[href="#all"]').addEventListener('click', this.#allFilterClickHandler);
  };

  setWatchlistFilterClickHandler = (callback) => {
    this._callback.watchlistFilterClick = callback;
    this.element.querySelector('[href="#watchlist"]').addEventListener('click', this.#watchlistFilterClickHandler);
  };

  setHistoryFilterClickHandler = (callback) => {
    this._callback.historyFilterClick = callback;
    this.element.querySelector('[href="#history"]').addEventListener('click', this.#historyFilterClickHandler);

  };

  setFavoritesFilterClickHandler = (callback) => {
    this._callback.favoritesFilterClick = callback;
    this.element.querySelector('[href="#favorites"]').addEventListener('click', this.#favoritesFilterClickHandler);
  };

  #allFilterClickHandler = (evt) => {
    this._callback.allFilterClick(evt);
  };

  #watchlistFilterClickHandler = (evt) => {
    this._callback.watchlistFilterClick(evt);
  };

  #historyFilterClickHandler = (evt) => {
    this._callback.historyFilterClick(evt);
  };

  #favoritesFilterClickHandler = (evt) => {
    this._callback.favoritesFilterClick(evt);
  };
}
