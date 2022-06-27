import {getRandomInteger, getRandomArrayElement} from '../utils/utils.js';
import {SAMPLE_SENTENCES, COMMENT_AUTHORS} from '../constants/mock-constants.js';
import {EMOJIS} from '../constants/constants.js';
import dayjs from 'dayjs';

export const generateComment = (_, commentID) => ({
  id: commentID,
  text: getRandomArrayElement(SAMPLE_SENTENCES),
  emoji: EMOJIS[getRandomInteger(0, EMOJIS.length - 1)],
  author: getRandomArrayElement(COMMENT_AUTHORS),
  date: dayjs().year(getRandomInteger(2010, 2022)).month(getRandomInteger(0, 11)).date(getRandomInteger(1, 31)).format(),
});
