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
      <h4>Hello</h4>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["authorized"]),
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
