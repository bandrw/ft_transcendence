<template>
  <div>
    <div v-if="!message">
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
      <div id="user_login_button" v-on:click="createAccount">login</div>
    </div>
    <div v-show="message" id="thank_you">
      <h4>{{ message }}</h4>
    </div>
  </div>
</template>

<script>
import eventService from "../services/eventService";
import cryptService from "../services/cryptService";

export default {
  data() {
    return {
      password1: null,
      password2: null,
      login: null,
      error: null,
      message: null,
    };
  },
  methods: {
    clear() {
      if (!this.error) {
        this.login = null;
        this.password1 = null;
        this.password2 = null;
      }
    },
    redirectToLogin() {
      this.message = null;
      this.$router.push("login");
    },
    checkBadSymbols(res) {
      const bad = " /|;<>&?:{}[]()";
      if (res.data.length === 1) {
        for (let k = 0; k < bad.length; k++) {
          if (res.data === bad[k]) {
            this.error = "bad symbol in login: '" + bad[k] + "'";
            return;
          }
        }
      } else {
        this.error = null;
        this.message = "Hello " + this.login + "! Thank you for registration";
        setTimeout(this.redirectToLogin, 3000);
      }
    },
    async creating(err, hash) {
      await eventService
        .createUser({ pass: hash, login: this.login })
        .then(this.checkBadSymbols);
      this.clear();
    },
    getResponse(res) {
      return res.data;
    },
    async createAccount() {
      if (!this.login) {
        this.error = "please enter login";
      } else if (!this.password1) {
        this.error = "please enter password";
      } else if (!this.password2) {
        this.error = "please enter password again";
      } else if (this.login.length < 4) {
        this.error = "login too short";
      } else if (this.login.length > 16) {
        this.error = "login too long";
      } else if (this.password1 !== this.password2) {
        this.error = "passwords are not equal";
      } else if (this.password1.length < 6) {
        this.error = "password too short";
      } else if (
        await eventService.checkExist(this.login).then(this.getResponse)
      ) {
        this.error = "user with the same login already exist";
      } else {
        cryptService.hash(this.password1, 10, this.creating);
        return;
      }
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
