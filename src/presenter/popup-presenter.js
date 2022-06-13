import {render, remove, replace} from '../framework/render.js';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {

  #popupComponent = null;

  init = (film, comments) => {
    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(film, comments);
    const documentBody = document.querySelector('body');
    //const onFilmCardClickBound = onFilmCardClick.bind(this);

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        this.#removePopup(documentBody, this.#popupComponent, onEscKeyDown);
      }
    };

    // function onFilmCardClick(evt) {
    //   if (!this.#popupComponent.element.contains(evt.target) &&
    //   evt.target.classList.length &&
    //   evt.target.classList[0].match(/film-card/)) {
    //     this.#removePopup(documentBody, this.#popupComponent, onEscKeyDown, onFilmCardClickBound);
    //   }
    // }

    document.addEventListener('keydown', onEscKeyDown);
    //document.addEventListener('click', onFilmCardClickBound, true);
    this.#popupComponent.setCloseButtonClickHandler(() => {
      this.#removePopup(documentBody, this.#popupComponent, onEscKeyDown);
    });

    if(prevPopupComponent === null){
      render(this.#popupComponent, documentBody, 'beforeend');
      return;
    }

    if(document.contains(prevPopupComponent)) {
      replace(this.#popupComponent, prevPopupComponent);
    }

    remove(prevPopupComponent);
  };

  #removePopup(documentBody, onEscKeyDown, onFilmCardClickBound) {
    documentBody.classList.remove('hide-overflow');
    remove(this.#popupComponent);
    document.removeEventListener('keydown', onEscKeyDown);
    document.removeEventListener('click', onFilmCardClickBound, true);
  }
}
