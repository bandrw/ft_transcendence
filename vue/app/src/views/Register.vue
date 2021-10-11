<template>
  <div>
    <div id="user_register_login">
      login: <input v-model="login" type="text" />
    </div>
    <div id="user_register_pass1">
      pass: <input v-model="password1" type="password" />
    </div>
    <div id="user_register_pass2">
      repeat: <input v-model="password2" type="password" />
    </div>
    <p v-if="error" id="user_register_error_message">error: {{ error }}</p>
    <div id="user_login_button" v-on:click="register">login</div>
    <div v-show="message" id="thank_you">
      <h4>{{ message }}</h4>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      password1: null,
      password2: null,
      login: null,
    };
  },
  computed: {
    ...mapState("userRegister", ["error", "message"]),
  },
  methods: {
    ...mapActions("userRegister", ["createAccount"]),
    clear() {
      if (!this.error) {
        this.login = null;
        this.password1 = null;
        this.password2 = null;
      }
    },
    register() {
      this.createAccount({
        login: this.login,
        password1: this.password1,
        password2: this.password2,
      });
      this.clear();
    },
  },
};
</script>

<style scoped>
#user_register_login {
  position: absolute;
  top: 20%;
  left: 5%;
}

#user_register_pass1 {
  position: absolute;
  top: 45%;
  left: 5%;
}

#user_register_pass2 {
  position: absolute;
  top: 70%;
  left: 5%;
}

#user_register_error_message {
  position: absolute;
  top: 10%;
  right: 5%;
}

#thank_you {
  text-align: center;
  top: 40%;
}
</style>
