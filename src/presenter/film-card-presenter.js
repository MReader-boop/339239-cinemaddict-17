import PopupPresenter from './popup-presenter.js';
import FilmCardView from '../view/film-card-view.js';
import {render} from '../render.js';

export default class FilmCardPresenter {

  #filmContainer = null;

  constructor(filmContainer) {
    this.#filmContainer = filmContainer;
  }

  init = (film, comments) => {
    const filmCardComponent = new FilmCardView(film);
    const documentBody = document.querySelector('body');

    render(filmCardComponent, this.#filmContainer.element);

    filmCardComponent.setClickHandler(() => {
      documentBody.classList.add('hide-overflow');
      const popupPresenter = new PopupPresenter();
      popupPresenter.init(film, comments);
    });
  };
}
