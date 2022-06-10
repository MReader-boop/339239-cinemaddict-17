import AbstractView from '../framework/view/abstract-view.js';

const createFooterContentsTemplate = () => '<p>0 movies inside</p>';

export default class FooterContentsView extends AbstractView {
  get template() {
    return createFooterContentsTemplate();
  }
}
