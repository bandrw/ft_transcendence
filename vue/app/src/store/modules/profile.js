export const namespaced = true;

export const state = {
  profile: false,
  history: [],
};

export const mutations = {
  SET_PROFILE(state, profile) {
    state.profile = profile;
  },
  SET_HISTORY(state, history) {
    state.history = history;
  },
  ADD_HISTORY(state, new_game_in_history) {
    state.history.unshift(new_game_in_history);
  },
};
