import FilmListView from '../view/film-list-view.js';
import NoFilmsListView from '../view/no-films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmCardPresenter from './film-card-presenter.js';
import {remove, render} from '../framework/render.js';
import {sortByRating, sortByDate} from '../utils/film-utils.js';
import {SortType, UserAction, UpdateType} from '../constants/constants.js';

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
  #filtersModel = null;
  #currentSortType = SortType.DEFAULT;

  constructor(pageMainElement, filmsModel, commentsModel, filtersModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filtersModel = filtersModel;
    this.#pageMainElement = pageMainElement;
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return this.#filmsModel.films.slice().sort(sortByDate);
      case SortType.RATING:
        return this.#filmsModel.films.slice().sort(sortByRating);
    }
    return this.#filmsModel.films;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#renderFilmCardsList();
  };

  #renderFilmCard = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmContainer, this.#handleUserAction, this.#closeActivePopup);
    filmCardPresenter.init(film, this.comments);
    this.#filmCardPresenters.set(film.info.id, filmCardPresenter);
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

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        //обновить фильм и попап, если он открыт
        this.#filmCardPresenters.get(data.info.id).init(data, this.comments);
        break;
      case UpdateType.MINOR:
        //обновить список фильмов (например если выбран фильтр вотчлиста, и пользователь убирает оттуда фильм)
        this.#clearFilmList();
        this.#renderFilmCardsList(this.films);
        break;
      case UpdateType.MAJOR:
        //обновить всю доску (например при переключении фильтра)
        this.#clearFilmList();
        this.#renderFilmCardsList(this.films);
        break;
    }
  };

  #handleUserAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.SWITCH_WATCHLIST:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.SWITCH_WATCHED:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.SWITCH_FAVORITES:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.CHANGE_FILTER:
        //здесь будет фильтрация
        break;
    }
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
