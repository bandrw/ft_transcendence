import Vue from "vue";
import Vuex from "vuex";
import * as ladder from "./modules/ladder";
import * as game from "./modules/game";
import * as chat from "./modules/chat";
import * as profile from "./modules/profile";
import eventService from "../services/eventService";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authorized: false,
    user: false,
    onlineUsers: [],
    enemy: false,
    eventSource: false,
    innerHeight: null,
    innerWidth: null,
  },
  mutations: {
    SET_TOKEN(state, token) {
      localStorage.setItem("token", token);
      eventService.setTokenHeader(token);
    },
    CLEAR_TOKEN() {
      localStorage.removeItem("token");
      // eventService.clearTokenHeader();
    },
    SET_INNER_HEIGHT(state, height) {
      state.innerHeight = height;
    },
    SET_INNER_WIDTH(state, width) {
      state.innerWidth = width;
    },
    CREATE_EVENT_SOURCE(state, login) {
      state.eventSource = new EventSource(
        `http://localhost:3000/users/login?login=${login}`
      );
    },
    CLOSE_EVENT_SOURCE(state) {
      state.eventSource.close();
    },
    ADD_USER(state, user) {
      state.onlineUsers.push(user);
    },
    DEL_USER(state, index) {
      state.onlineUsers.splice(index, 1);
    },
    INCREMENT_USER_GAMES(state, index) {
      ++state.onlineUsers[index].games;
    },
    INCREMENT_USER_WINS(state, index) {
      ++state.onlineUsers[index].wins;
    },
    SET_AUTHORIZE(state, status) {
      state.authorized = status;
    },
    SET_USER_ENTITY(state, index) {
      state.user = state.onlineUsers[index];
      state.user.password = null;
    },
    SET_USERS(state, users) {
      state.onlineUsers = users;
    },
    SET_ENEMY(state, index) {
      state.enemy = state.onlineUsers[index];
    },
    CLEAR_ENEMY(state) {
      state.enemy = null;
    },
    CLEAR_USER(state) {
      state.user = null;
    },
    SET_NEW_USER_AVATAR(state, avatar) {
      state.user.url_avatar = avatar;
    },
    SET_USER_STATUS(state, data) {
      state.onlineUsers[data.index].status = data.status;
    },
    SET_USER_URL_AVATAR(state, data) {
      state.onlineUsers[data.index].url_avatar = data.url_avatar;
    },
  },
  actions: {
    setUsers({ commit }, data) {
      commit("SET_USERS", data.users);
      commit("SET_USER_ENTITY", data.index);
      commit("SET_AUTHORIZE", true);
    },
  },
  getters: {
    usersExceptByName(state) {
      return state.onlineUsers.filter(
        (users) => users.login !== state.user.login
      );
    },
  },
  modules: {
    ladder: ladder,
    game: game,
    chat: chat,
    profile: profile,
  },
});
