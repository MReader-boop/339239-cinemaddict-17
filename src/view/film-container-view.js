import {createElement} from '../render.js';

const createFilmContainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmContainerView {
  getTemplate() {
    return createFilmContainerTemplate();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
