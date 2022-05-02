import NewNavigationView from './view/navigation-view.js';
import NewSortingView from './view/sorting-view.js';
import NewFilmCardView from './view/film-card-view.js';
import NewProfileView from './view/profile-view.js';
import NewShowMoreButtonView from './view/show-more-button-view.js';
import NewPopupView from './view/popup-view.js';
import {render} from './render.js';

const pageMainElement = document.querySelector('main');
const pageHeaderElement = document.querySelector('header');
const filmList = pageMainElement.querySelector('.films-list__container');

render(new NewProfileView(), pageHeaderElement);
render(new NewNavigationView(), pageMainElement, 'afterbegin');

const navigationBar = pageMainElement.querySelector('.main-navigation');

render(new NewSortingView(), navigationBar, 'afterend');

for (let i = 0; i < 5; i++) {
  render(new NewFilmCardView(), filmList);
}

render(new NewShowMoreButtonView(), pageMainElement);

render(new NewPopupView(), document.body);
