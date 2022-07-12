import AbstractView from '../framework/view/abstract-view.js';

const createFilmListTemplate = () =>
  `<section class="films">
    <section class="films-list">

    </section>
  </section>`;

export default class FilmListView extends AbstractView {
  get template() {
    return createFilmListTemplate();
  }
}
