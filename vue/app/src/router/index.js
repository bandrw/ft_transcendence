import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register";
import main from "../views/main";
import profile from "../views/profile";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "main",
    component: main,
    meta: { requireAuth: true },
    children: [
      {
        path: "/profile/:username",
        name: "profile",
        component: profile,
        meta: { requireAuth: true },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    alias: "/registration",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem("token");
  if (to.matched.some((record) => record.meta.requireAuth) && !loggedIn) {
    next({ name: "login" });
  }
  next();
});

export default router;
