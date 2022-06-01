import {generateComment} from '../le-fishe-data/comment.js';

export default class CommentsModel {
  comments = Array.from({length: 400}, generateComment);

  getComments = () => this.comments;
}
