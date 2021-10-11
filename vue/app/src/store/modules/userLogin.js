import eventService from "../../services/eventService";
import cryptService from "../../services/cryptService";

export const namespaced = true;

export const state = {
  error: null,
};

export const mutations = {
  SET_ERROR(state, error) {
    state.error = error;
  },
  CLEAR_ERROR(state) {
    state.error = null;
  },
};

export const actions = {
  async fetchAuthorize({ commit, dispatch }, data) {
    if (!data.login) {
      commit("SET_ERROR", "please enter login");
      return;
    } else if (!data.password) {
      commit("SET_ERROR", "please enter password");
      return;
    }
    const user = await eventService.login(data.login).then((response) => {
      return response.data;
    });
    if (user) {
      if (cryptService.comparePassword(data.password, user.password)) {
        const onlineUsers = eventService
          .onlineUsers()
          .then(function (response) {
            return response.data ? response.data : [];
          });
        dispatch(
          "setUsers",
          { users: onlineUsers, user: user },
          { root: true }
        );
        commit("CLEAR_ERROR");
      } else {
        commit("SET_ERROR", "Wrong password");
      }
    } else {
      commit("SET_ERROR", `User with login '${data.login}' not found`);
    }
  },
};
