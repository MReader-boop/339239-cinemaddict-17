import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../constants/constants.js';
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
    this.#comments = this.#filterComments(film, comments);

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(film, this.#comments);
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
      const prevScrollPosition = prevPopupComponent.element.scrollTop;
      replace(this.#popupComponent, prevPopupComponent);

      this.#popupComponent.element.scrollTop = prevScrollPosition;
    }

    remove(prevPopupComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.removePopup(this.#popupComponent);
    }
  };

  #handleWatchlistButtonClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#updateData(UserAction.SWITCH_WATCHLIST, UpdateType.PATCH, this.#film);
  };

  #handlewatchedButtonClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#updateData(UserAction.SWITCH_WATCHED, UpdateType.PATCH, this.#film);
  };

  #handlefavoriteButtonClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#updateData(UserAction.SWITCH_FAVORITES, UpdateType.PATCH, this.#film);
  };

  #filterComments = (film, comments) => comments.filter((comment) => film.info.commentIDs.includes(comment.id));

  removePopup() {
    if(this.#mode === Mode.OPEN){
      this.#mode = Mode.CLOSED;
      document.body.classList.remove('hide-overflow');
      remove(this.#popupComponent);
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }
}
