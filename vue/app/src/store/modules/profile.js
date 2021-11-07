export const namespaced = true;

export const state = {
  profile: false,
  users: [],
  history: [],
};

export const mutations = {
  SET_PROFILE(state, profile) {
    state.profile = profile;
  },
  SET_HISTORY(state, data) {
    state.history = data.history;
  },
  ADD_HISTORY(state, new_game_in_history) {
    state.history.unshift(new_game_in_history);
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
};
