import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../constants.js';

const createSortingTemplate = (currentSortType) => (`
  <ul class="sort">
    <li>
      <a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}">Sort by default</a>
    </li>
    <li>
      <a href="#" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}">Sort by date</a>
    </li>
    <li>
      <a href="#" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}">Sort by rating</a>
    </li>
  </ul>`
);

const determineSortingType = (evt) => {
  if(evt.target.textContent.includes('default')){
    return SortType.DEFAULT;
  }
  if(evt.target.textContent.includes('date')){
    return SortType.DATE;
  }
  if(evt.target.textContent.includes('rating')){
    return SortType.RATING;
  }
};

export default class SortingView extends AbstractView {

  #currentSortType = null;

  constructor(sortType) {
    super();
    this.#currentSortType = sortType;
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();

    this._callback.sortTypeChange(determineSortingType(evt));
  };
}
