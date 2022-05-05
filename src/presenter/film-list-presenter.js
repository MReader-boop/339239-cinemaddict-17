import FilmCardView from '../view/film-card-view.js';
import FilmListView from '../view/film-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortingView from '../view/sorting-view.js';
import FilmContainerView from '../view/film-container-view.js';
import {render} from '../render.js';

export default class FilmListPresenter {
  filmListComponent = new FilmListView();
  filmContainer = new FilmContainerView();

  init = (pageMainElement, navigationBar) => {
    render(new SortingView(), navigationBar, 'afterend');
    render(this.filmListComponent, pageMainElement);
    render(this.filmContainer, this.filmListComponent.getElement().querySelector('.films-list'));
    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmContainer.getElement());
    }
    render(new ShowMoreButtonView(), this.filmListComponent.getElement().querySelector('.films-list'));
  };
}
