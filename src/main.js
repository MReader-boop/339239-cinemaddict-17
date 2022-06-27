import FiltersView from './view/filters-view.js';
import ProfileView from './view/profile-view.js';
import FooterContentsView from './view/footer-contents-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import {render} from './framework/render.js';

const pageMainElement = document.querySelector('main');
const pageHeaderElement = document.querySelector('header');
const footerStatisticsElement = document.querySelector('.footer__statistics');
const navigationBar = new FiltersView();
const filmListPresenter = new FilmListPresenter();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();


render(new ProfileView(), pageHeaderElement);
render(navigationBar, pageMainElement, 'afterbegin');
render(new FooterContentsView(), footerStatisticsElement);

filmListPresenter.init(pageMainElement, filmsModel, commentsModel);
