const SortType = {
  DEFAULT: 'DEFAULT',
  DATE: 'DATE',
  RATING: 'RATING'
};

const FilterType = {
  WATCHLIST: 'WATCHLIST',
  HISTORY: 'HISTORY',
  FAVORITES: 'FAVORITES'
};

const EMOJIS = ['smile', 'sleeping', 'puke', 'angry'];

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const UserAction = {
  SWITCH_WATCHLIST: 'SWITCH_WATCHLIST',
  SWITCH_WATCHED: 'SWITCH_WATCHED',
  SWITCH_FAVORITES: 'SWITCH_FAVORITES',
  CHANGE_FILTER: 'CHANGE_FILTER',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export {UserAction, UpdateType, FilterType, SortType, EMOJIS};
