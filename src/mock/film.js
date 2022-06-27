import {getRandomInteger, getRandomFloatingPoint, getRandomArrayElement, getRandomArrayElements} from '../utils/utils.js';
import {AGE_RATINGS, FILM_NAMES, POSTERS, SAMPLE_SENTENCES, GENRES, DIRECTORS, WRITERS, ACTORS, COUNTRIES} from '../constants/mock-constants.js';
import dayjs from 'dayjs';

export const generateFilm = (_, filmID) => ({
  info: {
    id: filmID,
    commentIDs: Array.from(new Set(Array.from({length: getRandomInteger(0, 50)}, () => getRandomInteger(0, 400)))),
    title: getRandomArrayElement(FILM_NAMES),
    alternativeTitle: getRandomArrayElement(SAMPLE_SENTENCES),
    totalRating: getRandomFloatingPoint(1, 10),
    poster: getRandomArrayElement(POSTERS),
    ageRating: getRandomArrayElement(AGE_RATINGS),
    director: getRandomArrayElement(DIRECTORS),
    writers: getRandomArrayElements(WRITERS, getRandomInteger(1, WRITERS.length)),
    actors: getRandomArrayElements(ACTORS, getRandomInteger(1, ACTORS.length)),
    release: {
      date: dayjs().year(getRandomInteger(1930, 2000)).month(getRandomInteger(0, 11)).date(getRandomInteger(1, 31)),
      country: getRandomArrayElement(COUNTRIES)
    },
    runtime: getRandomInteger(70, 190),
    genres: getRandomArrayElements(GENRES, getRandomInteger(1, GENRES.length)),
    description: getRandomArrayElements(SAMPLE_SENTENCES, getRandomInteger(1, SAMPLE_SENTENCES.length)).join(' ')
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: dayjs().format(),
    favorite: getRandomInteger(0, 1),
  }
});
