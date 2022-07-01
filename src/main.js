import FiltersView from './view/filters-view.js';
import ProfileView from './view/profile-view.js';
import FooterContentsView from './view/footer-contents-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FiltersModel from './model/filters-model.js';
import {render} from './framework/render.js';

const pageMainElement = document.querySelector('main');
const pageHeaderElement = document.querySelector('header');
const footerStatisticsElement = document.querySelector('.footer__statistics');
const filtersComponent = new FiltersView();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filtersModel = new FiltersModel();
const filtersPresenter = new FiltersPresenter(filtersComponent, pageMainElement);
const filmListPresenter = new FilmListPresenter(pageMainElement, filmsModel, commentsModel, filtersModel);


render(new ProfileView(), pageHeaderElement);
render(new FooterContentsView(), footerStatisticsElement);

filtersPresenter.init();
filmListPresenter.init();
