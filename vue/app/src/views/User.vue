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
    <div v-if="authorized && !gameInProgress" class="user_authorized">
      <div class="user_logout_button" v-on:click="logout">logout</div>
      <div class="user_profile_button" v-on:click="showProfile">
        {{ user.login }}
      </div>
    </div>
    <div v-show="profile && authorized && !gameInProgress" class="user_profile">
      <img :src="user.url_avatar" class="user_profile_avatar" alt="" />
      <div id="user_update_avatar" v-on:click="updateAvatar"></div>
      <div id="game_stats_count">
        <p>games: {{ user.games }}</p>
      </div>
      <div id="game_stats_wins">
        <p>wins: {{ user.wins }}</p>
      </div>
      <div id="game_stats_winPercent">
        <p>wins: {{ winPercent }}%</p>
      </div>
      <div class="user_profile_close_button" v-on:click="showProfile">x</div>
    </div>
    <game ref="game" v-if="gameInProgress && authorized" />
    <Ladder ref="Ladder" v-if="!gameInProgress && authorized" />
    <chat v-if="!gameInProgress && authorized" />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import eventService from "../services/eventService";

export default {
  computed: {
    winPercent() {
      const winP = (this.user.wins / this.user.games).toFixed(2) * 100;
      return winP ? winP : 0;
    },
    ...mapState("ladder", ["ladder", "game"]),
    ...mapState(["authorized", "user"]),
    ...mapState("profile", ["profile"]),
    ...mapState("game", ["gameInProgress", "enemy", "id"]),
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
    async logout() {
      if (this.gameInProgress) {
        this.$refs.Ladder.clearData();
      }
      this.CLOSE_EVENT_SOURCE();
      await eventService.logout(this.user);
      this.SET_ENEMY(null);
      this.SET_AUTHORIZE(false);
      this.SET_PROFILE(false);
      this.SET_USERS(null);
    },
    showProfile() {
      this.SET_PROFILE(!this.profile);
    },
    getData(res) {
      return res.data;
    },
    async updateAvatar() {
      const avatar = eventService
        .updateAvatar(this.user.login)
        .then(this.getData);
      this.SET_NEW_USER_AVATAR(avatar);
    },
    async logoutIfAuthorized() {
      if (this.authorized) {
        await this.logout();
      }
    },
    stopPlatform(event) {
      if (event.key === "ArrowRight") {
        this.CLEAR_RIGHT_INTERVAL();
      } else if (event.key === "ArrowLeft") {
        this.CLEAR_LEFT_INTERVAL();
      }
    },
    keyEvents(event) {
      if (event.key === "ArrowRight" && this.gameInProgress) {
        this.$refs.game.movePlatformRight();
      } else if (event.key === "ArrowLeft" && this.gameInProgress) {
        this.$refs.game.movePlatformLeft();
      } else if (event.key === "Escape") {
        if (this.ladder && this.authorized && !this.game && !this.enemy) {
          this.logout();
        } else if (this.ladder && this.authorized && this.game) {
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
      }
    },
  },
  mounted() {
    window.onbeforeunload = this.logoutIfAuthorized;
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
#game_stats_count {
  width: 12%;
  height: 5%;
  right: 25%;
  top: 20%;
  position: absolute;
}

#game_stats_wins {
  width: 12%;
  height: 5%;
  right: 40%;
  top: 20%;
  position: absolute;
}

#game_stats_winPercent {
  width: 12%;
  height: 5%;
  right: 55%;
  top: 20%;
  position: absolute;
}

.user_authorized {
  min-width: 100px;
  min-height: 50px;
  width: 20%;
  height: 10%;
  background-color: crimson;
  position: absolute;
  right: 0;
  top: 0;
}

.user_logout_button {
  width: 30%;
  height: 74%;
  background-color: chocolate;
  position: absolute;
  top: 25%;
  right: 1%;
}

.user_profile_button {
  width: 67%;
  height: 74%;
  background-color: green;
  position: absolute;
  top: 25%;
  left: 1%;
}

.user_profile {
  width: 40%;
  height: 30%;
  background-color: darkviolet;
  position: absolute;
  top: 1%;
  right: 21%;
}

.user_profile_close_button {
  position: absolute;
  top: 1%;
  right: 1%;
  width: 5%;
  height: 12%;
  text-align: center;
  background-color: aqua;
}

.user_profile_avatar {
  position: absolute;
  left: 1%;
  top: 1%;
  width: 25%;
  height: 50%;
}

#user_update_avatar {
  position: absolute;
  top: 1%;
  left: 1%;
  width: 5%;
  height: 12%;
  text-align: center;
  background-color: beige;
}
</style>
