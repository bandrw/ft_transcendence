<template>
  <div id="app_vue">
    <div v-show="!this.authorized" id="nav">
      <router-link :to="{ name: 'login' }">Login</router-link>
      <router-link :to="{ name: 'register' }">Register</router-link>
    </div>
    <div :id="userAuthorizationStatus" v-if="screenSize">
      <router-view />
    </div>
    <div v-else>
      <h1>Sorry you screen to small</h1>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["authorized", "innerHeight", "innerWidth"]),
    userAuthorizationStatus() {
      return !this.authorized ? "user_unauthorized" : "";
    },
    screenSize() {
      return this.innerHeight > 500 && this.innerWidth > 800;
    },
  },
  methods: {
    ...mapMutations(["SET_INNER_HEIGHT", "SET_INNER_WIDTH"]),
    updateScreenSize() {
      this.SET_INNER_WIDTH(window.innerWidth);
      this.SET_INNER_HEIGHT(window.innerHeight);
    },
  },
  mounted() {
    this.SET_INNER_WIDTH(window.innerWidth);
    this.SET_INNER_HEIGHT(window.innerHeight);
    window.addEventListener("resize", this.updateScreenSize);
  },
};
</script>

<style>
a {
  font-weight: bold;
  color: #2c3e50;
  margin: auto 0.8em auto 0.4em;
  text-decoration: none;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
}

#nav {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0.2em 1em;
  background: linear-gradient(to right, #16c0b0, #ccfff2);
}

.router-link-exact-active {
  color: white;
  border-bottom: 2px solid #fff;
}

#app_vue {
  background: #ccfff2;
  width: 100%;
  height: 100%;
  position: absolute;
}

h1 {
  text-align: center;
}

#user_unauthorized {
  width: 50%;
  height: 27%;
  min-width: 500px;
  min-height: 250px;
  max-width: 600px;
  max-height: 300px;
  position: absolute;
  left: 15%;
  top: 15%;
  background: linear-gradient(to bottom, #16c0b0, #ccfff2);
}

#user_login_button {
  border-radius: 15px;
  background: #16c0b0;
  box-shadow: 24px 24px 47px #9b9b9b, -24px -24px 47px #ffffff;
  width: 25%;
  height: 25%;
  position: absolute;
  right: 5%;
  bottom: 25%;
}
</style>
