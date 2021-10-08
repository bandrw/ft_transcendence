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
      src="https://yt3.ggpht.com/ytc/AAUvwniWlUa-gZ5YNz8-2Mtada9CZOHaX8o4nGaq5JWc=s900-c-k-c0x00ffffff-no-rj"
      id="intra_img"
      alt=""
    />
  </div>
</template>

<script>
import axios from "axios";
import bcryptjs from "bcryptjs";

export default {
  data() {
    return {
      login: "",
      password: "",
      im: {},
      error: false,
      users: [],
    };
  },
  methods: {
    async authorize() {
      this.im = axios
        .post("nest-connector:3000/users/login", { login: this.login })
        .then((response) => {
          return response.data;
        })
        .catch((reason) => {
          console.log("There was an error: " + reason.response);
        });
      if (this.im) {
        if (bcryptjs.compareSync(this.password, this.im.password)) {
          this.im.password = false;
          this.error = false;
          this.users = await axios
            .get("nest-connector:3000/users/getOnline")
            .then(function (response) {
              return response.data;
            })
            .catch((reason) => {
              console.log("There was an error: " + reason.response);
            });
        } else {
          this.error = "Wrong password";
        }
      } else {
        this.error = "User with login '" + this.login + "' not found";
      }
    },
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

.user_login_button > p {
  font-size: large;
  text-align: center;
}

#intra_img {
  width: 15%;
  height: 20%;
  right: 5%;
  top: 10%;
  position: absolute;
  object-position: 75% 25%;
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

#login_error {
  position: absolute;
  bottom: 0;
}
</style>
