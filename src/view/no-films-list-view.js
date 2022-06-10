import AbstractView from '../framework/view/abstract-view.js';

const createNoFilmsListTemplate = () =>
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>

    </section>
  </section>`;

export default class NoFilmsListView extends AbstractView {
  get template() {
    return createNoFilmsListTemplate();
  }
}
