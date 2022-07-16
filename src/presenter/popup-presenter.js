import {render, remove, replace} from '../framework/render.js';
import { removeArrayElement } from '../utils/utils.js';
import {UserAction, UpdateType} from '../constants/constants.js';
import { sortCommentByDate } from '../utils/film-utils.js';
import PopupView from '../view/popup-view.js';
import CommentsListView from '../view/comments-list-view.js';
import CommentView from '../view/comment-view.js';
import NewCommentView from '../view/new-comment-view.js';
import dayjs from 'dayjs';
import he from 'he';

const Mode = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

export default class PopupPresenter {
  #maxCommentID = 400;
  #commentsListContainer = null;
  #newCommentComponent = null;
  #popupComponent = null;
  #commentsModel = null;
  #commentComponents = new Map();
  #filmsModel = null;
  #film = null;
  #comments = null;
  #updateFilmData = null;
  #mode = null;

  constructor(updateFilmData, commentsModel, filmsModel) {
    this.#updateFilmData = updateFilmData;
    this.#commentsModel = commentsModel;
    this.#filmsModel = filmsModel;
    this.#commentsModel.addObserver(this.#handleCommentsModelEvent);
  }

  init = (film) => {
    const prevPopupComponent = this.#popupComponent;
    this.#commentsListContainer = new CommentsListView();
    this.#newCommentComponent = new NewCommentView();
    this.#film = film;
    this.#comments = this.#setComments(this.#film, this.#commentsModel.comments);
    this.#popupComponent = new PopupView(this.#film, this.#comments);
    this.#mode = Mode.OPEN;

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#popupComponent.setCloseButtonClickHandler(() => {
      this.removePopup();
    });

    render(this.#commentsListContainer, this.#popupComponent.element.querySelector('.film-details__comments-wrap'), 'beforeend');
    render(this.#newCommentComponent, this.#popupComponent.element.querySelector('.film-details__comments-wrap'), 'beforeend');

    this.#popupComponent.setWatchlistButtonHandler(this.#handleWatchlistButtonClick);
    this.#popupComponent.setWatchedButtonHandler(this.#handleWatchedButtonClick);
    this.#popupComponent.setFavoriteButtonHandler(this.#handleFavoriteButtonClick);
    this.#newCommentComponent.setEnterKeydownHandler(this.#handleEnterKeydown);

    this.#filmsModel.addObserver(this.#handleFilmsModelEvent);

    if(prevPopupComponent === null){
      render(this.#popupComponent, document.body, 'beforeend');
      this.#renderComments(this.#comments);
      return;
    }

    if(document.body.contains(prevPopupComponent.element)) {
      const prevScrollPosition = prevPopupComponent.element.scrollTop;
      replace(this.#popupComponent, prevPopupComponent);
      this.#renderComments(this.#comments);

      this.#popupComponent.element.scrollTop = prevScrollPosition;
    }

    remove(prevPopupComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.removePopup();
    }
  };

  #handleWatchlistButtonClick = () => {
    this.#updateFilmData(UserAction.SWITCH_WATCHLIST, UpdateType.MINOR, this.#film);
  };

  #handleWatchedButtonClick = () => {
    this.#updateFilmData(UserAction.SWITCH_WATCHED, UpdateType.MINOR, this.#film);
  };

  #handleFavoriteButtonClick = () => {
    this.#updateFilmData(UserAction.SWITCH_FAVORITES, UpdateType.MINOR, this.#film);
  };

  #handleFilmsModelEvent = (_, update) => {
    if (this.#mode === Mode.OPEN && update.info.id === this.#film.info.id) {
      this.init(update);
    }
  };

  #handleCommentsModelEvent = () => {
    this.init(this.#film);
  };

  #handleCommentDeleteButtonClick = (comment) => {
    const newCommentIDs = removeArrayElement(this.#film.info.commentIDs, comment.id);
    this.#commentsModel.deleteComment(UpdateType.PATCH, comment);
    this.#updateFilmData(UserAction.DELETE_COMMENT, UpdateType.PATCH,
      {...this.#film, info: {...this.#film.info, commentIDs: newCommentIDs}});
  };

  #handleEnterKeydown = (localComment) => {
    this.#maxCommentID+=1;
    const newComment = {
      id: this.#maxCommentID,
      text: he.escape(localComment.comment),
      emoji: localComment.emotion,
      author: 'Movie Buff',
      date: dayjs()
    };
    const newCommentIDs = this.#film.info.commentIDs.slice();
    newCommentIDs.push(newComment.id);
    this.#commentsModel.addComment(UpdateType.PATCH, newComment);
    this.#updateFilmData(UserAction.ADD_COMMENT, UpdateType.PATCH,
      {...this.#film, info: {...this.#film.info, commentIDs: newCommentIDs}});

  };

  #renderComments = (comments) => {
    this.#commentComponents.clear();
    comments.forEach((comment) => {
      const commentComponent = new CommentView(comment);
      this.#commentComponents.set(comment.id, commentComponent);
      commentComponent.setCommentDeleteButtonClickHandler(this.#handleCommentDeleteButtonClick);
      render(commentComponent, this.#commentsListContainer.element);
    });
  };

  #setComments = (film, comments) => comments.filter((comment) => film.info.commentIDs.includes(comment.id)).sort(sortCommentByDate);

  removePopup() {
    if(this.#mode === Mode.OPEN){
      this.#mode = Mode.CLOSED;
      document.body.classList.remove('hide-overflow');
      remove(this.#popupComponent);
      this.#popupComponent = null;
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }
}
