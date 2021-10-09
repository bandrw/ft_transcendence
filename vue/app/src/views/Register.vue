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
    <div class="user_login_button" v-on:click="register">login</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: null,
      password1: null,
      password2: null,
      login: null,
    };
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
</style>
