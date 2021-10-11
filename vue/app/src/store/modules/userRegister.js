import eventService from "../../services/eventService";
import cryptService from "../../services/cryptService";

export const namespaced = true;

export const state = {
  error: null,
  message: null,
};

export const mutations = {
  SET_ERROR(state, error) {
    state.error = error;
  },
  CLEAR_ERROR(state) {
    state.error = null;
  },
  SET_MESSAGE(state, message) {
    state.message = message;
  },
  CLEAR_MESSAGE(state) {
    state.message = null;
  },
};

export const actions = {
  async createAccount({ commit }, data) {
    if (!data.login) {
      commit("SET_ERROR", "please enter login");
    } else if (!data.password1) {
      commit("SET_ERROR", "please enter password");
    } else if (!data.password2) {
      commit("SET_ERROR", "please enter password again");
    } else if (data.login.length < 4) {
      commit("SET_ERROR", "login too short");
    } else if (data.login.length > 16) {
      commit("SET_ERROR", "login too long");
    } else if (data.password1 !== data.password2) {
      commit("SET_ERROR", "passwords are not equal");
    } else if (data.password1.length < 6) {
      commit("SET_ERROR", "password too short");
    } else if (
      await eventService.checkExist(data.login).then(function (res) {
        return res.data;
      })
    ) {
      commit("SET_ERROR", "user with the same login already exist");
    } else {
      cryptService.hash(
        data.password1,
        10,
        async function (err, hash) {
          eventService.createUser({ pass: hash, login: data.login }).then(
            function (res) {
              const bad = " /|;<>&?:{}[]()";
              if (res.data.length === 1) {
                for (let k = 0; k < bad.length; k++) {
                  if (res.data === bad[k]) {
                    commit(
                      "SET_ERROR",
                      "bad symbol in login: '" + bad[k] + "'"
                    );
                    return;
                  }
                }
              } else {
                commit("CLEAR_ERROR");
                commit(
                  "SET_MESSAGE",
                  "Hello " + data.login + "! Thank you for registration"
                );
                setTimeout(function () {
                  commit("CLEAR_MESSAGE");
                }, 3000);
              }
            }.bind(this)
          );
        }.bind(this)
      );
    }
  },
};
