import {generateComment} from '../mock/comment.js';

export default class CommentsModel {
  comments = Array.from({length: 400}, generateComment);

  getComments = () => this.comments;
}
