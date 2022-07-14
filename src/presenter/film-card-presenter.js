import FilmCardView from '../view/film-card-view.js';
import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../constants/constants.js';

export default class FilmCardPresenter {

  #filmContainer = null;
  #filmCardComponent = null;
  #updateData = null;
  #film = null;
  #comments = null;
  #popupPresenter = null;
  #watchlistButton = null;
  #watchedButton = null;
  #favoriteButton = null;
  #closeActivePopup = null;

  constructor(popupPresenter, filmContainer, updateData, closeActivePopup, film) {
    this.#popupPresenter = popupPresenter;
    this.#filmContainer = filmContainer;
    this.#updateData = updateData;
    this.#closeActivePopup = closeActivePopup;
    this.#film = film;
  }

  init = () => {
    const prevFilmCardComponent = this.#filmCardComponent;
    this.#filmCardComponent = new FilmCardView(this.#film);

    this.#watchlistButton = this.#filmCardComponent.element.querySelector('.film-card__controls-item--add-to-watchlist');
    this.#watchedButton = this.#filmCardComponent.element.querySelector('.film-card__controls-item--mark-as-watched');
    this.#favoriteButton = this.#filmCardComponent.element.querySelector('.film-card__controls-item--favorite');

    this.#filmCardComponent.setClickHandler(this.#handleFilmCardClick);
    this.#filmCardComponent.setWatchlistButtonHandler(this.#handleWatchlistButtonClick);
    this.#filmCardComponent.setWatchedButtonHandler(this.#handleWatchedButtonClick);
    this.#filmCardComponent.setFavoriteButtonHandler(this.#handleFavoriteButtonClick);

    if(prevFilmCardComponent === null){
      render(this.#filmCardComponent, this.#filmContainer.element);
      return;
    }

    if(this.#filmContainer.element.contains(prevFilmCardComponent.element)){
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (this.popupPresenter) {
      this.popupPresenter.init(this.#film);
    }

    remove(prevFilmCardComponent);
  };

  #handleFilmCardClick = (evt) => {
    if(!evt.target.classList.contains('film-card__controls-item')) {
      this.#popupPresenter.init(this.#film);
    }
  };

  #handleWatchlistButtonClick = () => {
    this.#updateData(UserAction.SWITCH_WATCHLIST, UpdateType.MINOR, this.#film);
  };

  #handleWatchedButtonClick = () => {
    this.#updateData(UserAction.SWITCH_WATCHED, UpdateType.MINOR, this.#film);
  };

  #handleFavoriteButtonClick = () => {
    this.#updateData(UserAction.SWITCH_FAVORITES, UpdateType.MINOR, this.#film);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };
}
