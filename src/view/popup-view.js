import AbstractView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';

const createPopupTemplate = (film) => {
  const {poster, ageRating, title, alternativeTitle, totalRating, director, writers,
    actors, release, runtime, genres, description, commentIDs} = film.info;
  const {watchlist, alreadyWatched, favorite} = film.userDetails;

  return (`
      <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src=${poster} alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${dayjs(release.date).format('DD MMMM YYYY')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${Math.floor(runtime/60)}h ${runtime%60}m</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${release.country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button ${watchlist ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist"  id="watchlist" name="watchlist">${watchlist ? 'Added to watchlist' : 'Add to watchlist'}</button>
            <button type="button" class="film-details__control-button ${alreadyWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched">${alreadyWatched ? 'Already watched' : 'Not watched'}</button>
            <button type="button" class="film-details__control-button ${favorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite">${favorite ? 'Added to favorites' : 'Add to favorites'}</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentIDs.length}</span></h3>

          </section>
        </div>
      </form>
    </section>
  `);
};

export default class PopupView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createPopupTemplate(this.#film);
  }

  setWatchlistButtonHandler = (callback) => {
    this._callback.watchlistButtonClick = callback;

    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistButtonClickHandler);
  };

  setWatchedButtonHandler = (callback) => {
    this._callback.watchedButtonClick = callback;

    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedButtonClickHandler);
  };

  setFavoriteButtonHandler = (callback) => {
    this._callback.favoriteButtonClick = callback;

    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteButtonClickHandler);
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;

    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  };

  #watchlistButtonClickHandler = () => {
    this._callback.watchlistButtonClick();
  };

  #watchedButtonClickHandler = () => {
    this._callback.watchedButtonClick();
  };

  #favoriteButtonClickHandler = () => {
    this._callback.favoriteButtonClick();
  };

  #closeButtonClickHandler = () => {
    this._callback.closeButtonClick();
  };
}
