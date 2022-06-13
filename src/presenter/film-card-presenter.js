import PopupPresenter from './popup-presenter.js';
import FilmCardView from '../view/film-card-view.js';
import {render, remove, replace} from '../framework/render.js';

export default class FilmCardPresenter {

  #filmContainer = null;
  #filmCardComponent = null;

  constructor(filmContainer) {
    this.#filmContainer = filmContainer;
  }

  init = (film, comments) => {

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);
    const documentBody = document.querySelector('body');

    this.#filmCardComponent.setClickHandler((evt) => {
      if(!evt.target.classList.contains('film-card__controls-item')) {
        documentBody.classList.add('hide-overflow');
        const popupPresenter = new PopupPresenter();
        popupPresenter.init(film, comments);
      }
    });

    if(prevFilmCardComponent === null){
      render(this.#filmCardComponent, this.#filmContainer.element);
      return;
    }

    if(this.#filmContainer.contains(prevFilmCardComponent.element)){
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  };

  destroy = () => {
    remove(this.filmCardComponent);
  };
}
