import FilmCardView from '../view/film-card-view.js';
import FilmListView from '../view/film-list-view.js';
import NoFilmsListView from '../view/no-films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FilmContainerView from '../view/film-container-view.js';
import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmListPresenter {
  #noFilmsListComponent = new NoFilmsListView();
  #filmListComponent = new FilmListView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmContainer = new FilmContainerView();
  #renderedFilmCardsAmount = FILMS_COUNT_PER_STEP;
  #filteredComments = [];
  #filmsModel = null;
  #films = null;
  #commentsModel = null;
  #comments = null;


  init = (pageMainElement, filmsModel, commentsModel) => {
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    this.#commentsModel = commentsModel;
    this.#comments = [...this.#commentsModel.comments];

    render(new SortingView(), document.querySelector('.main-navigation'), 'afterend');
    if(this.#films.length){
      render(this.#filmListComponent, pageMainElement);
      render(this.#filmContainer, this.#filmListComponent.element.querySelector('.films-list'));

      for (let i = 0; i < Math.min(FILMS_COUNT_PER_STEP, this.#films.length); i++) {
        this.#filteredComments.push(this.#filterComments(this.#films[i], this.#comments));
        this.#renderFilmCard(this.#films[i], this.#filteredComments[i]);
      }

      if(this.#films.length > FILMS_COUNT_PER_STEP) {
        render(this.#showMoreButtonComponent, this.#filmListComponent.element.querySelector('.films-list'));

        this.#showMoreButtonComponent.element.addEventListener('click', this.#onShowMoreButtonClick);
      }
    } else {
      render(this.#noFilmsListComponent, pageMainElement);
    }
  };

  #onShowMoreButtonClick = () => {
    for (let i = this.#renderedFilmCardsAmount; i < this.#renderedFilmCardsAmount
      + Math.min(FILMS_COUNT_PER_STEP, this.#films.length - this.#renderedFilmCardsAmount); i++) {
      this.#filteredComments.push(this.#filterComments(this.#films[i], this.#comments));
      this.#renderFilmCard(this.#films[i], this.#filteredComments[i]);
    }

    this.#renderedFilmCardsAmount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmCardsAmount >= this.#films.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #filterComments = (film, comments) => comments.filter((comment) => film.info.commentIDs.includes(comment.id));

  #renderFilmCard = (film, comments) => {
    const filmCardComponent = new FilmCardView(film);
    const documentBody = document.querySelector('body');

    render(filmCardComponent, this.#filmContainer.element);

    filmCardComponent.element.addEventListener('click', () => {
      documentBody.classList.add('hide-overflow');
      this.#renderPopup(film, comments);
    });
  };

  #renderPopup = (film, comments) => {
    const popupComponent = new PopupView(film, comments);
    const documentBody = document.querySelector('body');
    const closeButton = popupComponent.element.querySelector('.film-details__close-btn');
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
    closeButton.addEventListener('click', () => {
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
