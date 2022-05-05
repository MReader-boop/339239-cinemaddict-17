import {createElement} from '../render.js';

const createFooterContentsTemplate = () => '<p>0 movies inside</p>';

export default class FooterContentsView {
  getTemplate() {
    return createFooterContentsTemplate();
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
