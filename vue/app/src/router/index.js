import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register";
import User from "../views/User";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "user",
    component: User,
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
  {
    path: "/main",
    redirect: { name: "user" },
  },
  // {
  //   path: "/user/:username",
  //   name: "user",
  //   component: User,
  //   props: true,
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
