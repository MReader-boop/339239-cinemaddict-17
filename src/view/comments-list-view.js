import AbstractView from '../framework/view/abstract-view.js';

const createFilmListTemplate = () =>
  `<ul class="film-details__comments-list">

  </ul>`;

export default class CommentsListView extends AbstractView {
  get template() {
    return createFilmListTemplate();
  }
}
