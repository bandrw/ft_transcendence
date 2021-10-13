import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import User from "./views/User";
import Ladder from "./views/Ladder";

Vue.config.productionTip = false;
Vue.component("User", User);
Vue.component("Ladder", Ladder);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
