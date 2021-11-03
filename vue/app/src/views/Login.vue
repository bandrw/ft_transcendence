<template>
  <div>
    <event-source ref="eventSource" />
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
import { mapActions, mapState } from "vuex";
import eventService from "../services/eventService";
import cryptService from "../services/cryptService";

export default {
  data() {
    return {
      login: null,
      password: null,
      error: null,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapActions(["setUsers"]),
    async authorize() {
      if (!this.login) {
        this.error = "please enter login";
        return;
      } else if (!this.password) {
        this.error = "please enter password";
        return;
      }
      this.$socket.emit("login", this.login);
    },
  },
  sockets: {
    async userEntity(data) {
      if (data === "doubleLogin") {
        this.error = "user with the same login already in game";
        return;
      }
      if (data.user) {
        if (cryptService.comparePassword(this.password, data.user.password)) {
          const onlineUsers = await eventService
            .onlineUsers()
            .then(function (response) {
              return response.data ? response.data : [];
            });
          data.user.socketId = data.socketId;
          this.setUsers({ users: onlineUsers, user: data.user });
          this.error = null;
          this.$refs.eventSource.listenEvents();
          await this.$router.push("user");
        } else {
          this.error = "Wrong password";
        }
      } else {
        this.error = `User with login '${this.login}' not found`;
      }
      if (!this.error) {
        this.login = null;
        this.password = null;
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
