export const namespaced = true;

export const state = {
  profile: false,
  users: [],
  history: [],
  arrayPage: 0,
  rowsPerPage: 5,
  currentPageInHistory: [],
};

export const mutations = {
  CLEAR_HISTORY(state) {
    state.arrayPage = 0;
    state.currentPageInHistory = [];
    state.history = [];
  },
  SET_PROFILE(state, profile) {
    state.profile = profile;
  },
  SET_HISTORY(state, history) {
    state.history = history;
  },
  ADD_HISTORY(state, new_game_in_history) {
    state.history.unshift(new_game_in_history);
  },
  SET_CURRENT_PAGE_IN_HISTORY(state, page) {
    state.currentPageInHistory = page;
  },

  UPDATE_USER_AVATAR_IN_HISTORY(state, user) {
    let i = 0;
    while (i < state.history.length) {
      if (user.login === state.history[i].user_one.login) {
        state.history[i].user_one.url_avatar = user.url_avatar;
      } else if (user.login === state.history[i].user_two.login) {
        state.history[i].user_two.url_avatar = user.url_avatar;
      }
      ++i;
    }
  },
  UPDATE_PAGE_NUMBER(state, pageNumber) {
    state.arrayPage = pageNumber;
  },
};

export const actions = {
  updatePageFromHistory({ state, commit }, pageNumber) {
    if (
      pageNumber > 0 &&
      (pageNumber - 1) * state.rowsPerPage < state.history.length
    ) {
      commit("UPDATE_PAGE_NUMBER", pageNumber - 1);
      const page = [];
      const i = state.arrayPage * state.rowsPerPage;
      let k = 0;
      while (i + k < state.history.length && k < state.rowsPerPage) {
        page.push(state.history[i + k]);
        ++k;
      }
      commit("SET_CURRENT_PAGE_IN_HISTORY", page);
    }
  },
};
