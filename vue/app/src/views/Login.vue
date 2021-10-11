<template>
  <div>
    <div id="login_login_text"><p>user ></p></div>
    <div id="login_login_input">
      <input
        v-model="login"
        type="text"
        class="input"
        placeholder="between 4 and 16 symbols"
      />
    </div>
    <div id="login_password_text"><p>password ^</p></div>
    <div id="login_password_input">
      <input
        v-model="password"
        type="password"
        class="input"
        placeholder="6 and more symbols"
      />
    </div>
    <div id="login_error">
      <p v-if="error">error: {{ error }}</p>
    </div>
    <div id="user_login_button" v-on:click="authorize"><p>login</p></div>
    <img
      src="../assets/intra.jpeg"
      height="900"
      width="900"
      id="intra_img"
      alt=""
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      login: null,
      password: null,
    };
  },
  methods: {
    ...mapActions("userLogin", ["fetchAuthorize"]),
    async authorize() {
      await this.fetchAuthorize({
        login: this.login,
        password: this.password,
      });
      if (!this.error) {
        this.login = null;
        this.password = null;
      }
    },
  },
  computed: {
    ...mapState("userLogin", ["error"]),
  },
};
</script>

<style scoped>
#login_login_input {
  left: 25%;
  top: 20%;
  position: absolute;
}

#login_login_text {
  left: 9%;
  top: 16%;
  position: absolute;
}

#login_password_input {
  left: 7%;
  top: 45%;
  position: absolute;
}

#login_password_text {
  left: 25%;
  top: 59%;
  position: absolute;
}

#intra_img {
  width: 15%;
  height: 20%;
  right: 5%;
  top: 10%;
  position: absolute;
  object-position: 75% 25%;
}

#login_error {
  position: absolute;
  bottom: 0;
}
</style>
