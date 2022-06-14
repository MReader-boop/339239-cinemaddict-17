import {render, remove, replace} from '../framework/render.js';
import PopupView from '../view/popup-view.js';

const Mode = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

export default class PopupPresenter {

  #popupComponent = null;
  #film = null;
  #comments = null;
  #updateData = null;
  #mode = null;

  constructor(updateData) {
    this.#updateData = updateData;
  }

  init = (film, comments) => {

    this.#film = film;
    this.#comments = comments;

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(film, comments);
    this.#mode = Mode.OPEN;

    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#popupComponent.setCloseButtonClickHandler(() => {
      this.removePopup(this.#popupComponent);
    });

    this.#popupComponent.setWatchlistButtonHandler(this.#handleWatchlistButtonClick);
    this.#popupComponent.setWatchedButtonHandler(this.#handlewatchedButtonClick);
    this.#popupComponent.setFavoriteButtonHandler(this.#handlefavoriteButtonClick);

    if(prevPopupComponent === null){
      render(this.#popupComponent, document.body, 'beforeend');
      return;
    }

    if(document.body.contains(prevPopupComponent.element)) {
      replace(this.#popupComponent, prevPopupComponent);
    }

    remove(prevPopupComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.removePopup(this.#popupComponent);
    }
  };

  #handleWatchlistButtonClick = () => {
    if(!this.#popupComponent.element.querySelector('.film-details__control-button--watchlist').classList.contains('film-details__control-button--active')){
      this.#popupComponent.element.querySelector('.film-details__control-button--watchlist').classList.add('film-details__control-button--active');
    } else {
      this.#popupComponent.element.querySelector('.film-details__control-button--watchlist').classList.remove('film-details__control-button--active');
    }

    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#updateData(this.#film);
  };

  #handlewatchedButtonClick = () => {
    if(!this.#popupComponent.element.querySelector('.film-details__control-button--watched').classList.contains('film-details__control-button--active')){
      this.#popupComponent.element.querySelector('.film-details__control-button--watched').classList.add('film-details__control-button--active');
    } else {
      this.#popupComponent.element.querySelector('.film-details__control-button--watched').classList.remove('film-details__control-button--active');
    }

    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#updateData(this.#film);
  };

  #handlefavoriteButtonClick = () => {
    if(!this.#popupComponent.element.querySelector('.film-details__control-button--favorite').classList.contains('film-details__control-button--active')){
      this.#popupComponent.element.querySelector('.film-details__control-button--favorite').classList.add('film-details__control-button--active');
    } else {
      this.#popupComponent.element.querySelector('.film-details__control-button--favorite').classList.remove('film-details__control-button--active');
    }

    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#updateData(this.#film);
  };

  removePopup() {
    if(this.#mode === Mode.OPEN){
      this.#mode = Mode.CLOSED;
      document.body.classList.remove('hide-overflow');
      remove(this.#popupComponent);
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }
}
