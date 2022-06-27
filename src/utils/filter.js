const filter = {
  WATCHLIST: (films) => films.filter((film) => film.userDetails.watchlist),
  HISTORY: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  FAVORITES: (films) => films.filter((film) => film.userDetails.favorite),
};

export {filter};
