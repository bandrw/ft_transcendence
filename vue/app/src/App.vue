<template>
  <div id="app_vue">
    <div :id="userAuthorizationStatus" v-if="screenSize">
      <div v-if="!this.authorized">
        <b-nav tabs>
          <b-nav-item :active="active1" @click="switchToLogin"
            >Login</b-nav-item
          >
          <b-nav-item :active="active2" @click="switchToRegister"
            >Register</b-nav-item
          >
        </b-nav>
      </div>
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
  data() {
    return {
      active1: true,
      active2: false,
    };
  },
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
    switchToLogin() {
      if (!this.active1) {
        this.active1 = true;
        this.active2 = false;
        this.$router.push("login");
      }
    },
    switchToRegister() {
      if (!this.active2) {
        this.active2 = true;
        this.active1 = false;
        this.$router.push("register");
      }
    },
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
#app_vue {
  background: #79e7af;
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
}

#user_login_button {
  border-radius: 15px;
  background: linear-gradient(145deg, #cacaca, #79e7af);
  box-shadow: 24px 24px 47px #9b9b9b, -24px -24px 47px #ffffff;
  width: 25%;
  height: 25%;
  position: absolute;
  right: 5%;
  bottom: 25%;
}
</style>
