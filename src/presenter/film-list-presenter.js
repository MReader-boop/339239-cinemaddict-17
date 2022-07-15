import FilmListView from '../view/film-list-view.js';
import NoFilmsListView from '../view/no-films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmCardPresenter from './film-card-presenter.js';
import PopupPresenter from './popup-presenter.js';
import {remove, render} from '../framework/render.js';
import {sortByRating, sortByDate} from '../utils/film-utils.js';
import {SortType, UserAction, UpdateType} from '../constants/constants.js';
import { filter } from '../utils/filter.js';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmListPresenter {
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmsListComponent = null;
  #filmListComponent = new FilmListView();
  #filmContainer = new FilmContainerView();
  #filmCardPresenters = new Map();
  #popupPresenter = null;
  #renderedFilmCardsAmount = FILMS_COUNT_PER_STEP;
  #pageMainElement = null;
  #sortingComponent = null;
  #filmsModel = null;
  #filtersModel = null;
  #commentsModel = null;
  #currentPopupID = null;
  #currentSortType = SortType.DEFAULT;

  constructor(pageMainElement, filmsModel, commentsModel, filtersModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filtersModel = filtersModel;
    this.#pageMainElement = pageMainElement;
    this.#popupPresenter = new PopupPresenter(this.#handleUserAction, this.#commentsModel, this.#filmsModel);
  }

  get films() {
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filtersModel.filter](films);
    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.slice().sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.slice().sort(sortByRating);
    }
    return filteredFilms;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {
    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#renderFilmCardsList();
  };

  #renderFilmCard = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#popupPresenter, this.#filmContainer, this.#handleUserAction, film, this.comments);
    filmCardPresenter.init();
    this.#filmCardPresenters.set(film.info.id, filmCardPresenter);
  };

  #renderFilmCards = (films) => {
    films.forEach((film) => {
      this.#renderFilmCard(film);
    });
  };

  #renderFilmCardsList = () => {
    if (this.#noFilmsListComponent) {
      remove(this.#noFilmsListComponent);
    }
    if(this.films.length) {
      const filmsCount = this.films.length;
      const films = this.films.slice(0, Math.min(filmsCount, this.#renderedFilmCardsAmount));
      this.#renderSortControls();

      render(this.#filmListComponent, this.#pageMainElement);
      render(this.#filmContainer, this.#filmListComponent.element.querySelector('.films-list'));

      this.#renderFilmCards(films);

      if(filmsCount > this.#renderedFilmCardsAmount) {
        render(this.#showMoreButtonComponent, this.#filmListComponent.element.querySelector('.films-list'));

        this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
      }
    } else {
      remove(this.#filmContainer);
      remove(this.#filmListComponent);
      this.#displayNoFilmsMessage();
    }
  };

  #updateFilmList = () => {
    this.#clearFilmList();
    if(this.films.length) {
      remove(this.#sortingComponent);
      this.#renderFilmCardsList();
    } else {
      remove(this.#filmContainer);
      remove(this.#filmListComponent);
      remove(this.#sortingComponent);
      this.#displayNoFilmsMessage();
    }
  };

  #clearFilmList = () => {
    this.#filmCardPresenters.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenters.clear();
    remove(this.#showMoreButtonComponent);
  };

  #displayNoFilmsMessage = () => {
    if (this.#noFilmsListComponent) {
      remove(this.#noFilmsListComponent);
    }
    this.#noFilmsListComponent = new NoFilmsListView(this.#filtersModel.filter);
    render(this.#noFilmsListComponent, this.#pageMainElement);
  };

  #renderSortControls = () => {
    this.#sortingComponent = new SortingView(this.#currentSortType);
    render(this.#sortingComponent, document.querySelector('.main-navigation'), 'afterend');

    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.MINOR:
        //обновить фильм и попап, если он открыт
        this.#updateFilmList();
        break;
      case UpdateType.MAJOR:
        //обновить всю доску (например при переключении фильтра)
        this.#renderedFilmCardsAmount = FILMS_COUNT_PER_STEP;
        this.#handleSortTypeChange(SortType.DEFAULT);
        remove(this.#sortingComponent);
        this.#clearFilmList();
        this.#renderFilmCardsList(this.films);
        break;
    }
  };

  #handleUserAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.SWITCH_WATCHLIST:
        this.#filmsModel.updateFilm(updateType, {...update, userDetails: {...update.userDetails, watchlist: !update.userDetails.watchlist}});
        break;
      case UserAction.SWITCH_WATCHED:
        this.#filmsModel.updateFilm(updateType, {...update, userDetails: {...update.userDetails, alreadyWatched: !update.userDetails.alreadyWatched}});
        break;
      case UserAction.SWITCH_FAVORITES:
        this.#filmsModel.updateFilm(updateType, {...update, userDetails: {...update.userDetails, favorite: !update.userDetails.favorite}});
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    remove(this.#sortingComponent);
    this.#currentSortType = sortType;
    this.#renderedFilmCardsAmount = FILMS_COUNT_PER_STEP;
    this.#clearFilmList();
    this.#renderFilmCardsList(this.films);
  };
}
