<template>
  <div v-show="this.authorized">
    <div v-show="!this.gameInProgress">
      <Ladder ref="Ladder" />
      <chat />
      <div id="mouse_outer" @mouseleave.stop="hideUserDropdown">
        <img
          :src="this.user.url_avatar"
          alt=""
          id="profile_image"
          @mouseover="showUserDropdown"
        />
        <div id="user_authorized" v-show="profile">
          <div id="user_logout_button" v-on:click="logout"><p>logout</p></div>
          <div id="user_profile_button" v-on:click="goToProfile">
            <p>{{ user.login }}</p>
          </div>
        </div>
      </div>
      <router-view />
    </div>
    <game ref="game" v-show="this.gameInProgress" />
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
    showUserDropdown() {
      this.SET_PROFILE(true);
    },
    hideUserDropdown() {
      this.SET_PROFILE(false);
    },
    goToProfile() {
      this.$router.push({
        name: "profile",
        params: { username: this.user.login },
      });
    },
    async logout() {
      if (this.gameInProgress) {
        this.$refs.Ladder.clearLadder();
      }
      this.CLOSE_EVENT_SOURCE();
      await eventService.logout(this.user);
      this.SET_ENEMY(null);
      this.SET_AUTHORIZE(false);
      this.SET_PROFILE(false);
      this.SET_USERS(null);
      await this.$router.push({ name: "login" });
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
      this.$router.push({ name: "login" });
    }
    document.addEventListener("keyup", this.stopPlatform);
    document.addEventListener("keydown", this.keyEvents);
  },
};
</script>

<style>
#mouse_outer {
  height: 27%;
  width: 18%;
  position: absolute;
  top: 0;
  right: 0;
}

#user_logout_button {
  width: 30%;
  height: 74%;
  background-color: chocolate;
  position: absolute;
  top: 25%;
  right: 1%;
  border-radius: 10%;
}

#user_profile_button {
  width: 67%;
  height: 74%;
  background-color: green;
  position: absolute;
  top: 25%;
  left: 1%;
  border-radius: 8%;
}

#user_authorized {
  min-width: 100px;
  min-height: 50px;
  width: 90%;
  height: 25%;
  position: absolute;
  bottom: 10%;
  left: 10%;
}

#profile_image {
  min-width: 50px;
  min-height: 50px;
  width: 61%;
  height: 61%;
  position: absolute;
  right: 15%;
  top: 0;
}

#user_login_button > p {
  font-size: large;
  text-align: center;
}

p {
  font-family: Serif, fantasy, sans-serif;
  text-align: center;
}

input {
  font-family: Arial sans-serif;
  font-size: medium;
}
</style>
