<template>
  <div>
    <div :id="userAuthorizationStatus" v-if="screenSize">
      <div v-if="!authorized">
        <router-link :to="{ name: 'login' }" class="tab">Login</router-link> |
        <router-link :to="{ name: 'register' }" class="tab"
          >Register</router-link
        >
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
  computed: {
    ...mapState(["authorized", "innerHeight", "innerWidth"]),
    userAuthorizationStatus() {
      return !this.authorized ? "user_unauthorized" : "empty";
    },
    screenSize() {
      return this.innerHeight > 350 && this.innerWidth > 830;
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
h1 {
  text-align: center;
}

.tab {
  text-align: left;
  width: 20%;
  background-color: beige;
  font-size: larger;
  margin: 1%;
  top: 5%;
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
