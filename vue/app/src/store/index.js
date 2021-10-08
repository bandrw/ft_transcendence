import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authorized: false,
    login: "",
    password: "",
    im: {},
  },
  mutations: {},
  actions: {},
  modules: {},
});
