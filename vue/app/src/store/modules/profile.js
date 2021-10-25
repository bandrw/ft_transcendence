export const namespaced = true;

export const state = {
  profile: false,
};

export const mutations = {
  SET_PROFILE(state, profile) {
    state.profile = profile;
  },
};
