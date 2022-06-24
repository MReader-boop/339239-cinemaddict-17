import PopupPresenter from './popup-presenter.js';
import FilmCardView from '../view/film-card-view.js';
import {render, remove, replace} from '../framework/render.js';

export default class FilmCardPresenter {

  #filmContainer = null;
  #filmCardComponent = null;
  #updateData = null;
  #film = null;
  #comments = null;
  #watchlistButton = null;
  #watchedButton = null;
  #favoriteButton = null;
  #closeActivePopup = null;
  popupPresenter = null;

  constructor(filmContainer, updateData, closeActivePopup) {
    this.#filmContainer = filmContainer;
    this.#updateData = updateData;
    this.#closeActivePopup = closeActivePopup;
  }

  init = (film, comments) => {
    const prevFilmCardComponent = this.#filmCardComponent;

    this.#film = film;
    this.#comments = comments;

    this.#filmCardComponent = new FilmCardView(this.#film);

    this.#watchlistButton = this.#filmCardComponent.element.querySelector('.film-card__controls-item--add-to-watchlist');
    this.#watchedButton = this.#filmCardComponent.element.querySelector('.film-card__controls-item--mark-as-watched');
    this.#favoriteButton = this.#filmCardComponent.element.querySelector('.film-card__controls-item--favorite');

    this.#filmCardComponent.setClickHandler(this.#handleFilmCardClick);
    this.#filmCardComponent.setWatchlistButtonHandler(this.#handleWatchlistButtonClick);
    this.#filmCardComponent.setWatchedButtonHandler(this.#handlewatchedButtonClick);
    this.#filmCardComponent.setFavoriteButtonHandler(this.#handlefavoriteButtonClick);

    if(prevFilmCardComponent === null){
      render(this.#filmCardComponent, this.#filmContainer.element);
      return;
    }

    if(this.#filmContainer.element.contains(prevFilmCardComponent.element)){
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (this.popupPresenter) {
      this.popupPresenter.init(this.#film, this.#comments);
    }

    remove(prevFilmCardComponent);
  };

  #handleFilmCardClick = (evt) => {
    if(!evt.target.classList.contains('film-card__controls-item')) {
      this.#closeActivePopup();
      document.querySelector('body').classList.add('hide-overflow');
      this.popupPresenter = new PopupPresenter(this.#updateData);
      this.popupPresenter.init(this.#film, this.#comments);
    }
  };

  #handleWatchlistButtonClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#updateData(this.#film);
  };

  #handlewatchedButtonClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#updateData(this.#film);
  };

  #handlefavoriteButtonClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#updateData(this.#film);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };
}
