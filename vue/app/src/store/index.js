import Vue from "vue";
import Vuex from "vuex";
import * as ladder from "./modules/ladder";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authorized: false,
    user: false,
    onlineUsers: [],
    enemy: false,
  },
  mutations: {
    SET_AUTHORIZE(state, status) {
      state.authorized = status;
    },
    SET_USER_ENTITY(state, entity) {
      state.user = entity;
      state.user.password = null;
    },
    SET_ONLINE_USERS(state, users) {
      state.onlineUsers = users;
    },
    SET_ENEMY(state, enemy) {
      state.enemy = enemy;
    },
  },
  actions: {
    setUsers({ commit, state }, data) {
      commit("SET_ONLINE_USERS", data.users);
      commit("SET_USER_ENTITY", data.user);
      commit("SET_AUTHORIZE", true);
      console.log(state.user);
    },
  },
  getters: {
    countUsersInGame(state) {
      return state.onlineUsers.filter((users) => users.status === "red").length;
    },
    countOnlineUsers: (state) => {
      return state.onlineUsers.length;
    },
    countFreeUsers: (state) => {
      return state.onlineUsers.filter((users) => users.status === "green")
        .length;
    },
    userByName: (state) => (login) => {
      return state.onlineUsers.find((user) => user.login === login);
    },
    userById(state, id) {
      return state.onlineUsers.find((user) => user.id === id);
    },
  },
  modules: {
    ladder: ladder,
  },
});
