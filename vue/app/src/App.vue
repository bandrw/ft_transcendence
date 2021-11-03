<template>
  <div :id="userAuthorizationStatus">
    <div v-if="!authorized">
      <router-link :to="{ name: 'login' }" class="tab">Login</router-link> |
      <router-link :to="{ name: 'register' }" class="tab">Register</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["authorized"]),
    userAuthorizationStatus() {
      return !this.authorized ? "user_unauthorized" : "empty";
    },
  },
};
</script>

<style>
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
