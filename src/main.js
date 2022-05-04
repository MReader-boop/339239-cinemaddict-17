import NavigationView from './view/navigation-view.js';
import ProfileView from './view/profile-view.js';
import FooterContentsView from './view/footer-contents-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import {render} from './render.js';

const pageMainElement = document.querySelector('main');
const pageHeaderElement = document.querySelector('header');
const footerStatisticsElement = document.querySelector('.footer__statistics');
const navigationBar = new NavigationView();
const filmListPresenter = new FilmListPresenter();

render(new ProfileView(), pageHeaderElement);
render(navigationBar, pageMainElement, 'afterbegin');
render(new FooterContentsView(), footerStatisticsElement);

filmListPresenter.init(pageMainElement, navigationBar.getElement());
