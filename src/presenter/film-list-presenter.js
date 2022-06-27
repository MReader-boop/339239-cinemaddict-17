import FilmListView from '../view/film-list-view.js';
import NoFilmsListView from '../view/no-films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmCardPresenter from './film-card-presenter.js';
import {remove, render} from '../framework/render.js';
import {sortByRating, sortByDate} from '../utils/film-utils.js';
import {SortType} from '../constants/constants.js';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmListPresenter {
  #noFilmsListComponent = new NoFilmsListView();
  #filmListComponent = new FilmListView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmContainer = new FilmContainerView();
  #filmCardPresenters = new Map();
  #renderedFilmCardsAmount = FILMS_COUNT_PER_STEP;
  #pageMainElement = null;
  #sortingComponent = null;
  #filmsModel = null;
  #commentsModel = null;
  #currentSortType = SortType.DEFAULT;

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortByDate);
      case SortType.RATING:
        return [...this.#filmsModel.films].sort(sortByRating);
    }
    return this.#filmsModel.films;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = (pageMainElement, filmsModel, commentsModel) => {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#pageMainElement = pageMainElement;

    this.#renderFilmCardsList();

  };

  #renderFilmCards = (films) => {

    films.forEach((film) => {
      this.#renderFilmCard(film);
    });
  };

  #renderFilmCardsList = () => {
    if(this.films.length) {
      const filmsCount = this.films.length;
      const films = this.films.slice(0, Math.min(filmsCount, FILMS_COUNT_PER_STEP));

      this.#renderSortControls();
      render(this.#filmListComponent, this.#pageMainElement);
      render(this.#filmContainer, this.#filmListComponent.element.querySelector('.films-list'));

      this.#renderFilmCards(films);

      if(filmsCount > FILMS_COUNT_PER_STEP) {
        render(this.#showMoreButtonComponent, this.#filmListComponent.element.querySelector('.films-list'));

        this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
      }
    } else {
      render(this.#noFilmsListComponent, this.#pageMainElement);
    }
  };

  #clearFilmList = () => {
    this.#filmCardPresenters.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenters.clear();
    this.#renderedFilmCardsAmount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #renderSortControls = () => {
    this.#sortingComponent = new SortingView(this.#currentSortType);
    render(this.#sortingComponent, document.querySelector('.main-navigation'), 'afterend');

    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #closeActivePopup = () => {
    for (const filmCardPresenter of this.#filmCardPresenters.values()){
      if(filmCardPresenter.popupPresenter){
        filmCardPresenter.popupPresenter.removePopup();
      }
    }
  };

  #onShowMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmCardsAmount = Math.min(filmsCount, this.#renderedFilmCardsAmount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCardsAmount, newRenderedFilmCardsAmount);

    this.#renderFilmCards(films);
    this.#renderedFilmCardsAmount = newRenderedFilmCardsAmount;

    if (this.#renderedFilmCardsAmount >= this.films.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleFilmCardChange = (updatedFilm) => {
    this.#filmsModel.updateFilm('PATCH', updatedFilm);
    this.#filmCardPresenters.get(updatedFilm.info.id).init(updatedFilm, this.comments);
  };

  #renderFilmCard = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmContainer, this.#handleFilmCardChange, this.#closeActivePopup);
    filmCardPresenter.init(film, this.comments);
    this.#filmCardPresenters.set(film.info.id, filmCardPresenter);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    remove(this.#sortingComponent);
    this.#currentSortType = sortType;
    this.#clearFilmList();
    this.#renderFilmCardsList(this.films);
  };
}
