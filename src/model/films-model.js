import {generateFilm} from '../mock/film.js';
import Observable from '../framework/observable.js';

export default class FilmsModel extends Observable {
  #films = Array.from({length: 14}, generateFilm);

  get films() {
    return this.#films;
  }
}
