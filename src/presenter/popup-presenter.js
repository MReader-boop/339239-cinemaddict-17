import {render} from '../render.js';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {


  init = (film, comments) => {
    const popupComponent = new PopupView(film, comments);
    const documentBody = document.querySelector('body');
    const onFilmCardClickBound = onFilmCardClick.bind(this);

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        this.#removePopup(documentBody, popupComponent, onEscKeyDown, onFilmCardClickBound);
      }
    };

    function onFilmCardClick(evt) {
      if (!popupComponent.element.contains(evt.target) &&
      evt.target.classList.length &&
      evt.target.classList[0].match(/film-card/)) {
        this.#removePopup(documentBody, popupComponent, onEscKeyDown, onFilmCardClickBound);
      }
    }

    render(popupComponent, documentBody, 'beforeend');

    document.addEventListener('keydown', onEscKeyDown);
    document.addEventListener('click', onFilmCardClickBound, true);
    popupComponent.setCloseButtonClickHandler(() => {
      this.#removePopup(documentBody, popupComponent, onEscKeyDown, onFilmCardClickBound);
    });
  };

  #removePopup(documentBody, popupComponent, onEscKeyDown, onFilmCardClickBound) {
    documentBody.classList.remove('hide-overflow');
    documentBody.removeChild(popupComponent.element);
    document.removeEventListener('keydown', onEscKeyDown);
    document.removeEventListener('click', onFilmCardClickBound, true);
  }
}
