<template>
  <div v-show="this.authorized">
    <div v-show="!this.gameInProgress">
      <Ladder ref="Ladder" />
      <chat />
      <div>
        <router-link :to="{ name: 'profile', params: { username: user.login } }"
          >profile</router-link
        >
      </div>
      <router-view />
      <!--      <profile ref="profile" v-on:clearLadder="clearLadder" />-->
    </div>
    <game ref="game" v-show="gameInProgress" />
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import eventService from "../services/eventService";

export default {
  computed: {
    ...mapState("ladder", ["ladder", "game"]),
    ...mapState(["authorized", "user", "enemy"]),
    ...mapState("profile", ["profile"]),
    ...mapState("game", ["gameInProgress", "id"]),
  },
  methods: {
    ...mapMutations("game", [
      "CLEAR_RIGHT_INTERVAL",
      "CLEAR_LEFT_INTERVAL",
      "SET_GAME_IN_PROGRESS",
    ]),
    ...mapMutations("profile", ["SET_PROFILE"]),
    ...mapMutations("ladder", [
      "CLEAR_FIND_INTERVAL",
      "CLEAR_ACCEPT_INTERVAL",
      "CLEAR_LADDER",
    ]),
    ...mapMutations([
      "CLOSE_EVENT_SOURCE",
      "SET_ENEMY",
      "SET_AUTHORIZE",
      "SET_USERS",
      "CLEAR_USER",
      "SET_NEW_USER_AVATAR",
    ]),
    clearLadder() {
      this.$refs.Ladder.clearLadder();
    },
    getData(res) {
      return res.data;
    },
    stopPlatform(event) {
      if (event.key === "ArrowRight") {
        this.CLEAR_RIGHT_INTERVAL();
      } else if (event.key === "ArrowLeft") {
        this.CLEAR_LEFT_INTERVAL();
      } else if (event.key === "Escape") {
        this.escapeEvents(event);
      }
    },
    escapeEvents(event) {
      if (this.authorized && !this.game && !this.enemy) {
        this.$refs.profile.logout();
      } else if (this.authorized && this.game) {
        if (!this.enemy) {
          this.$refs.Ladder.cancelFind(event);
        } else if (this.enemy && !this.gameInProgress) {
          this.$refs.Ladder.cancelAccept(event);
        } else if (this.enemy && this.gameInProgress) {
          this.$socket.emit("leaveGame", {
            login: this.user.login,
            id: this.id,
          });
          this.SET_GAME_IN_PROGRESS(false);
          eventService.setStatus(this.user.login, "blue");
          this.CLEAR_LADDER();
          this.SET_ENEMY(null);
        }
      }
    },
    keyEvents(event) {
      if (event.key === "ArrowRight" && this.gameInProgress) {
        this.$refs.game.movePlatformRight();
      } else if (event.key === "ArrowLeft" && this.gameInProgress) {
        this.$refs.game.movePlatformLeft();
      }
    },
  },
  mounted() {
    if (!this.authorized) {
      this.$router.push("Login");
    }
    document.addEventListener("keyup", this.stopPlatform);
    document.addEventListener("keydown", this.keyEvents);
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

p {
  font-family: Serif, fantasy, sans-serif;
}

input {
  font-family: Arial sans-serif;
  font-size: medium;
}
</style>
