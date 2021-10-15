import Vue from "vue";
import Vuex from "vuex";
import * as ladder from "./modules/ladder";

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
    UPDATE_USER(state, event) {
      const user = JSON.parse(event.data);
      if (
        state.users
          .map(function (e) {
            return e.login;
          })
          .indexOf(user.login) !== -1
      ) {
        let index = 0;
        while (index < state.users.length) {
          if (state.users[index].login === user.login) {
            state.users[index].status = user.status;
            state.users[index].url_avatar = user.url_avatar;
            break;
          }
          ++index;
        }
        if (state.enemy && state.enemy.login === user.login) {
          state.enemy.status = user.status;
          state.enemy.url_avatar = user.url_avatar;
        }
      }
    },
    UPDATE_USER_EVENT_SOURCE({ state, mutations }) {
      state.eventSource.addEventListener("updateUser", mutations.UPDATE_USER);
    },
    ENEMY(state, event) {
      state.enemy = JSON.parse(event.data);
      state.enemy.readyStatus = "yellow";
    },
    ENEMY_EVENT_SOURCE({ mutations, state }) {
      state.eventSource.addEventListener("enemy", mutations.ENEMY);
    },
    ENEMY_IS_READY(state) {
      state.enemy.readyStatus = "green";
    },
    ENEMY_IS_READY_EVENT_SOURCE({ state, mutations }) {
      state.eventSource.addEventListener(
        "enemyIsReady",
        mutations.ENEMY_IS_READY
      );
    },
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
    setUsers({ commit }, data) {
      commit("SET_ONLINE_USERS", data.users);
      commit("SET_USER_ENTITY", data.user);
      commit("SET_AUTHORIZE", true);
    },
    // listenEvents(commit, login) {
    //   commit("CREATE_EVENT_SOURCE", login);
    //   commit("ADD_USER_EVENT_SOURCE");
    //   commit("UPDATE_USER_STATS_EVENT_SOURCE");
    //   commit("LOGOUT_SSE_EVENT_SOURCE");
    //   commit("UPDATE_USER_EVENT_SOURCE");
    //   commit("ENEMY_EVENT_SOURCE");
    //   commit("ENEMY_IS_READY_EVENT_SOURCE");
    // },
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
