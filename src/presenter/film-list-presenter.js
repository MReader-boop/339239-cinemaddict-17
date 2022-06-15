import FilmListView from '../view/film-list-view.js';
import NoFilmsListView from '../view/no-films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmCardPresenter from './film-card-presenter.js';
import {render} from '../framework/render.js';
import {updateItem} from '../utils.js';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmListPresenter {
  #noFilmsListComponent = new NoFilmsListView();
  #filmListComponent = new FilmListView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmContainer = new FilmContainerView();
  #sortingComponent = new SortingView();
  #filmCardPresenters = new Map();
  #filteredComments = new Map();
  #renderedFilmCardsAmount = FILMS_COUNT_PER_STEP;
  #filmsModel = null;
  #films = null;
  #commentsModel = null;
  #comments = null;

  init = (pageMainElement, filmsModel, commentsModel) => {
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    this.#commentsModel = commentsModel;
    this.#comments = [...this.#commentsModel.comments];

    render(this.#sortingComponent, document.querySelector('.main-navigation'), 'afterend');

    if(this.#films.length){
      render(this.#filmListComponent, pageMainElement);
      render(this.#filmContainer, this.#filmListComponent.element.querySelector('.films-list'));

      this.#films.forEach((film) => {
        this.#filteredComments.set(film.info.id, this.#filterComments(film, this.#comments));
      });

      for (let i = 0; i < Math.min(FILMS_COUNT_PER_STEP, this.#films.length); i++) {
        this.#renderFilmCard(this.#films[i], this.#comments);
      }

      if(this.#films.length > FILMS_COUNT_PER_STEP) {
        render(this.#showMoreButtonComponent, this.#filmListComponent.element.querySelector('.films-list'));

        this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
      }
    } else {
      render(this.#noFilmsListComponent, pageMainElement);
    }
  };

  #closeActivePopup = () => {
    for (const filmCardPresenter of this.#filmCardPresenters.values()){
      if(filmCardPresenter.popupPresenter){
        filmCardPresenter.popupPresenter.removePopup();
      }
    }
  };

  #onShowMoreButtonClick = () => {
    for (let i = this.#renderedFilmCardsAmount; i < this.#renderedFilmCardsAmount
      + Math.min(FILMS_COUNT_PER_STEP, this.#films.length - this.#renderedFilmCardsAmount); i++) {
      this.#renderFilmCard(this.#films[i], this.#comments);
    }

    this.#renderedFilmCardsAmount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmCardsAmount >= this.#films.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #handleFilmCardChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmCardPresenters.get(updatedFilm.info.id).init(updatedFilm, this.#filteredComments.get(updatedFilm.info.id));
  };

  #renderFilmCard = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmContainer, this.#handleFilmCardChange, this.#closeActivePopup);
    filmCardPresenter.init(film, this.#filteredComments.get(film.info.id));
    this.#filmCardPresenters.set(film.info.id, filmCardPresenter);
  };

  #filterComments = (film, comments) => comments.filter((comment) => film.info.commentIDs.includes(comment.id));
}
