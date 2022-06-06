import FilmCardView from '../view/film-card-view.js';
import FilmListView from '../view/film-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FilmContainerView from '../view/film-container-view.js';
import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

export default class FilmListPresenter {
  #filmListComponent = new FilmListView();
  #filmContainer = new FilmContainerView();
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
    render(this.#filmListComponent, pageMainElement);
    render(this.#filmContainer, this.#filmListComponent.element.querySelector('.films-list'));

    for (let i = 0; i < this.#films.length; i++) {
      this.#filteredComments.push(this.#filterComments(this.#films[i], this.#comments));
      this.#renderFilmCards(this.#films[i], this.#filteredComments[i]);
    }

    render(new ShowMoreButtonView(), this.#filmListComponent.element.querySelector('.films-list'));

  };

  #filterComments = (film, comments) => comments.filter((comment) => film.info.commentIDs.includes(comment.id));

  #renderFilmCards = (film, comments) => {
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

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        removePopup();
      }
    };

    const onOutOfPopupClick = (evt) => {
      if (!popupComponent.element.contains(evt.target)) {
        removePopup();
      }
    };

    function removePopup() {
      documentBody.classList.remove('hide-overflow');
      documentBody.removeChild(popupComponent.element);
      document.removeEventListener('keydown', onEscKeyDown);
      document.removeEventListener('click', onOutOfPopupClick, true);
    }

    render(popupComponent, documentBody, 'beforeend');

    document.addEventListener('keydown', onEscKeyDown);
    document.addEventListener('click', onOutOfPopupClick, true);
    popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      removePopup();
    });
  };
}
