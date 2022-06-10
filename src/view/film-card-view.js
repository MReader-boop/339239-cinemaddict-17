import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const createCardTemplate = (film) => {
  const {poster, title, totalRating, release, runtime, genres, description, commentIDs} = film.info;
  const {watchlist, alreadyWatched, favorite} = film.userDetails;

  return (`
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3><p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dayjs(release.date).format('YYYY')}</span>
        <span class="film-card__duration">${Math.floor(runtime/60)}h ${runtime%60}m</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src=${poster} alt="" class="film-card__poster">
      <p class="film-card__description">
      ${description.length > 140 ?
      `${description.slice(0, 140)}...` :
      description}
      </p>
      <span class="film-card__comments">${commentIDs.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
    </div>
  </article>
  `);
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createCardTemplate(this.#film);
  }

  setClickHandler = (callback) => {

    this._callback.click = callback;

    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = () => {
    this._callback.click();
  };
}
