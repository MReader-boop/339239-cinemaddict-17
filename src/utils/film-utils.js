const compareByDate = (filmA, filmB) => {
  if (filmA.info.release.date.diff(filmB.info.release.date) > 0) {
    return filmA.info.release.date;
  }

  if (filmA.info.release.date.diff(filmB.info.release.date) < 0) {
    return filmB.info.release.date;
  }

  return null;
};
const compareByRating = (filmA, filmB) => Math.max(filmA.info.totalRating, filmB.info.totalRating);

const sortByDate = (filmA, filmB) => {
  if (compareByDate(filmA, filmB) === filmA.info.release.date) {
    return -1;
  }

  if (compareByDate(filmA, filmB) === filmB.info.release.date) {
    return 1;
  }

  return 0;
};

const sortByRating = (filmA, filmB) => {
  if (compareByRating(filmA, filmB) === filmA.info.totalRating) {
    return -1;
  }

  if (compareByRating(filmA, filmB) === filmB.info.totalRating) {
    return 1;
  }

  return 0;
};

export {sortByRating, sortByDate};
