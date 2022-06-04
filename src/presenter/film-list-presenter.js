import FilmCardView from '../view/film-card-view.js';
import FilmListView from '../view/film-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FilmContainerView from '../view/film-container-view.js';
import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

export default class FilmListPresenter {
  filmListComponent = new FilmListView();
  filmContainer = new FilmContainerView();
  filteredComments = [];

  init = (pageMainElement, filmsModel, commentsModel) => {
    this.filmsModel = filmsModel;
    this.films = [...filmsModel.films];
    this.commentsModel = commentsModel;
    this.comments = [...commentsModel.comments];

    render(new SortingView(), document.querySelector('.main-navigation'), 'afterend');
    render(this.filmListComponent, pageMainElement);
    render(this.filmContainer, this.filmListComponent.element.querySelector('.films-list'));
    for (let i = 0; i < this.films.length; i++) {
      this.filteredComments.push(this.comments.filter((comment) => this.films[0].info.commentIDs.includes(comment.id)));
      render(new FilmCardView(this.films[i]), this.filmContainer.element);
    }
    render(new ShowMoreButtonView(), this.filmListComponent.element.querySelector('.films-list'));
    render(new PopupView(this.films[0], this.filteredComments[0]), document.querySelector('body'), 'beforeend');
  };
}
