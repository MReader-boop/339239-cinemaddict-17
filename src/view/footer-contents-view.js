import {createElement} from '../render.js';

const createFooterContentsTemplate = () => '<p>0 movies inside</p>';

export default class FooterContentsView {

  #element = null;

  get template() {
    return createFooterContentsTemplate();
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;

  }
}
