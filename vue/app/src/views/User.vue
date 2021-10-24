<template>
  <div>
    <div v-if="!authorized" id="user_unauthorized">
      <div>
        <router-link :to="{ name: 'login' }" class="tab">Login</router-link> |
        <router-link :to="{ name: 'register' }" class="tab"
          >Register</router-link
        >
      </div>
      <router-view />
    </div>
    <div v-else>
      <game v-if="gameInProgress" />
      <Ladder v-else />
      <chat v-if="!gameInProgress" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["authorized"]),
    ...mapState("game", ["gameInProgress"]),
  },
};
</script>

<style>
body {
  background-color: #79e7af;
}

#user_login_button > p {
  font-size: large;
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

.tab {
  text-align: left;
  width: 20%;
  background-color: beige;
  font-size: larger;
  margin: 1%;
  top: 5%;
}

p {
  font-family: Serif, fantasy, sans-serif;
}

input {
  font-family: Arial sans-serif;
  font-size: medium;
}
</style>
