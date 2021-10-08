import Vue from "vue";
import Vuex from "vuex";
import eventService from "../services/eventService";
import cryptService from "../services/cryptService";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authorized: false,
    login: "",
    password: "",
    user: {},
    error: false,
    onlineUsers: []
  },
  mutations: {
    SET_AUTHORIZE(state, status) {
      state.authorized = status
    },
    SET_USER_ENTITY(state, entity) {
      state.user = entity
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_USER_PASSWORD(state) {
      state.password = ""
    },
    CLEAR_ERROR(state) {
      state.error = false
    },
    SET_ONLINE_USERS(state, users) {
      state.onlineUsers = users
    }
  },
  actions: {
    async fetchAuthorize(context, state) {
      if (!state.login) {
        context.commit('SET_ERROR', "please enter login")
        return
      } else if (!state.password) {
        context.commit('SET_ERROR', "please enter password")
        return
      }
      context.commit('SET_USER_ENTITY', await eventService
        .login(state.login)
        .then((response) => {
          return response.data ? response.data : {}
        })
        .catch((reason) => {
          console.log("There was an error: " + reason.response);
          return {}
        }))
      if (state.user) {
        if (cryptService.comparePassword(state.password, state.user.password)) {
          context.commit('CLEAR_USER_PASSWORD')
          context.commit('SET_ONLINE_USERS', await eventService
            .onlineUsers()
            .then(function (response) {
              return response.data ? response.data : []
            })
            .catch((reason) => {
              console.log("There was an error: " + reason.response)
              return []
            }))
          context.commit('SET_AUTHORIZE', true)
          context.commit('CLEAR_ERROR')
        } else {
          context.commit('SET_ERROR', "Wrong password")
        }
      } else {
        context.commit('SET_ERROR', `User with login '${state.login}' not found`)
      }
    }
  },
  getters: {
    usersInGame(state) {
      return state.onlineUsers.filter(users => users.status === 'red')
    },
    onlineUsers(state) {
      return state.onlineUsers
    },
    authorized(state) {
      return state.authorized
    },
    error(state) {
      return state.error
    },
    user(state) {
      return state.user
    }
  },
  modules: {},
});
