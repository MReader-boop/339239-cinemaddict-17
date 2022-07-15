import AbstractView from '../framework/view/abstract-stateful-view';
import dayjs from 'dayjs';

const createCommentTemplate = (comment) => (
  `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-${comment.emoji}">
  </span>
  <div>
    <p class="film-details__comment-text">${comment.text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${comment.author}</span>
      <span class="film-details__comment-day">${dayjs(comment.date).format('YYYY/MM/DD H:mm')}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
  </li>`
);

export default class CommentView extends AbstractView {
  #comment = null;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }
}
