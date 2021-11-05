import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import main from "./views/main";
import Ladder from "./views/Ladder";
import eventSource from "./views/eventSource";
import game from "./views/game";
import io from "socket.io/client-dist/socket.io";
import VueSocketIO from "vue-socket.io";
import chat from "./views/chat";
import profle from "./views/profile";

Vue.directive("scroll", {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener("scroll", f);
      }
    };
    window.addEventListener("scroll", f);
  },
});

Vue.config.productionTip = false;
Vue.use(
  new VueSocketIO({
    connection: io("http://localhost:3000", { transports: ["websocket"] }),
  })
);
Vue.component("Main", main);
Vue.component("Ladder", Ladder);
Vue.component("eventSource", eventSource);
Vue.component("game", game);
Vue.component("chat", chat);
Vue.component("profile", profle);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
