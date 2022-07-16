import {remove, render} from '../framework/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../constants/constants.js';
import FiltersView from '../view/filters-view.js';

export default class FiltersPresenter {
  #filtersModel = null;
  #filmsModel = null;
  #pageMainElement = null;
  #filtersComponent = null;

  get filters() {
    return [
      {
        type: FilterType.ALL,
        name: 'all',
        count: filter[FilterType.ALL](this.#filmsModel.films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'watchlist',
        count: filter[FilterType.WATCHLIST](this.#filmsModel.films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'history',
        count: filter[FilterType.HISTORY](this.#filmsModel.films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'favorites',
        count: filter[FilterType.FAVORITES](this.#filmsModel.films).length,
      }
    ];
  }

  constructor(pageMainElement, filtersModel, filmsModel) {
    this.#pageMainElement = pageMainElement;
    this.#filtersModel = filtersModel;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#filtersComponent = new FiltersView(this.filters, this.filters.find(
      (element) => element.type === this.#filtersModel.filter).name);

    this.#filtersComponent.setAllFilterClickHandler(this.#handleAllFilterClick);
    this.#filtersComponent.setWatchlistFilterClickHandler(this.#handleWatchlistFilterClick);
    this.#filtersComponent.setHistoryFilterClickHandler(this.#handleHistoryFilterClick);
    this.#filtersComponent.setFavoritesFilterClickHandler(this.#handleFavoritesFilterClick);

    render(this.#filtersComponent, this.#pageMainElement, 'afterbegin');
    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
  };

  #handleModelEvent = () => {
    remove(this.#filtersComponent);
    this.init();
  };

  #handleUserAction = (newFilterType) => {
    this.#filtersModel.setFilter(UpdateType.MAJOR, newFilterType);
  };

  #handleAllFilterClick = (evt) => {
    evt.preventDefault();
    this.#handleUserAction(FilterType.ALL);
  };

  #handleWatchlistFilterClick = (evt) => {
    evt.preventDefault();
    this.#handleUserAction(FilterType.WATCHLIST);
  };

  #handleHistoryFilterClick = (evt) => {
    evt.preventDefault();
    this.#handleUserAction(FilterType.HISTORY);
  };

  #handleFavoritesFilterClick = (evt) => {
    evt.preventDefault();
    this.#handleUserAction(FilterType.FAVORITES);
  };
}
