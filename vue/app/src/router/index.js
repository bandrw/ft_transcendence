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
    children: [
      {
        path: "/profile/:username",
        name: "profile",
        component: profile,
        // props: true,
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
  {
    path: "/main",
    redirect: { name: "main" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
