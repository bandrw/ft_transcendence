import Vue from "vue";
import Vuex from "vuex";
import eventService from "../services/eventService";
import cryptService from "../services/cryptService";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authorized: false,
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
    SET_ONLINE_USERS(state, users) {
      state.onlineUsers = users
    },
    CLEAR_ERROR(state) {
      state.error = false
    },
    CLEAR_USER_PASSWORD(state) {
      state.user.password = ""
    }
  },
  actions: {
    async fetchAuthorize({context, state}, {login, password}) {
      if (!login) {
        context.commit('SET_ERROR', "please enter login")
        return
      } else if (!password) {
        context.commit('SET_ERROR', "please enter password")
        return
      }
      const user = await eventService
        .login(login)
        .then((response) => {
          return response.data ? response.data : {}
        })
        .catch((reason) => {
          console.log("There was an error: " + reason);
          return {}
        })
      if (user) {
        if (cryptService.comparePassword(password, state.user.password)) {
          context.commit('SET_USER_ENTITY', user)
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
        context.commit('SET_ERROR', `User with login '${login}' not found`)
      }
    }
  },
  getters: {
    countUsersInGame(state) {
      return state.onlineUsers.filter(users => users.status === 'red').length
    },
    countOnlineUsers: state => {
      return state.onlineUsers.length
    },
    countFreeUsers: state => {
      return state.onlineUsers.filter(users => users.status === 'green').length
    },
    onlineUsers(state) {
      return state.onlineUsers
    },
    userByName: state => login => {
      return state.onlineUsers.find(user => user.login === login)
    },
    userById(state, id) {
      return state.onlineUsers.find(user => user.id === id)
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
