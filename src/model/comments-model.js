import {generateComment} from '../mock/comment.js';
import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #comments = Array.from({length: 400}, generateComment);

  get comments() {
    return this.#comments;
  }
}
