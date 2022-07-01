import {render} from '../framework/render.js';

export default class FiltersPresenter {
  #filtersComponent = null;
  #pageMainElement = null;

  constructor(filtersComponent, pageMainElement) {
    this.#filtersComponent = filtersComponent;
    this.#pageMainElement = pageMainElement;
  }

  init = () => {
    render(this.#filtersComponent, this.#pageMainElement, 'afterbegin');
  };


}
