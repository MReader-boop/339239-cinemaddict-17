import {render} from '../framework/render.js';
import {filter} from '../utils/filter.js';
import { FilterType } from '../constants/constants.js';
import FiltersView from '../view/filters-view.js';

export default class FiltersPresenter {
  #filtersModel = null;
  #filmsModel = null;
  #pageMainElement = null;

  get filters() {
    return [
      {
        type: FilterType.ALL,
        name: 'all',
        count: filter.ALL(this.#filmsModel.films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'watchlist',
        count: filter.WATCHLIST(this.#filmsModel.films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'history',
        count: filter.HISTORY(this.#filmsModel.films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'favorites',
        count: filter.FAVORITES(this.#filmsModel.films).length,
      }
    ];
  }

  constructor(pageMainElement, filtersModel, filmsModel) {
    this.#pageMainElement = pageMainElement;
    this.#filtersModel = filtersModel;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    const filtersComponent = new FiltersView(this.filters, 'history');
    render(filtersComponent, this.#pageMainElement, 'afterbegin');
  };


}
