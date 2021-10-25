import Vue from "vue";
import Vuex from "vuex";
import * as ladder from "./modules/ladder";
import * as game from "./modules/game";
import * as chat from "./modules/chat";
import * as profile from "./modules/profile";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authorized: false,
    user: false,
    users: [],
    enemy: false,
    eventSource: false,
  },
  mutations: {
    CREATE_EVENT_SOURCE(state, login) {
      state.eventSource = new EventSource(
        `http://localhost:3000/users/login?login=${login}`
      );
    },
    CLOSE_EVENT_SOURCE(state) {
      state.eventSource.close();
    },
    ADD_USER(state, user) {
      state.users.push(user);
    },
    DEL_USER(state, index) {
      state.users.splice(index, 1);
    },
    INCREMENT_USER_GAMES(state) {
      ++state.user.games;
    },
    INCREMENT_USER_WINS(state) {
      ++state.user.wins;
    },
    INCREMENT_USERS_GAMES(state, index) {
      ++state.users[index].games;
    },
    INCREMENT_USERS_WINS(state, index) {
      ++state.user[index].wins;
    },
    SET_AUTHORIZE(state, status) {
      state.authorized = status;
    },
    SET_USER_ENTITY(state, entity) {
      state.user = entity;
      state.user.password = null;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_ENEMY(state, enemy) {
      state.enemy = enemy;
    },
    CLEAR_USER(state) {
      state.user = null;
    },
  },
  actions: {
    setUsers({ commit }, data) {
      commit("SET_ONLINE_USERS", data.users);
      commit("SET_USER_ENTITY", data.user);
      commit("SET_AUTHORIZE", true);
    },
  },
  getters: {
    usersExceptByName(state) {
      return state.users.filter((users) => users.login !== state.user.login);
    },
  },
  modules: {
    ladder: ladder,
    game: game,
    chat: chat,
    profile: profile,
  },
});
