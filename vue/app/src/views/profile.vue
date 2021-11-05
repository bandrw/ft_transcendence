<template>
  <div>
    <div v-if="!gameInProgress && authorized" id="user_authorized">
      <div id="user_logout_button" v-on:click="logout">logout</div>
      <div id="user_profile_button" v-on:click="showProfile">
        {{ user.login }}
      </div>
    </div>
    <div v-show="profile && authorized && !gameInProgress" id="user_profile">
      <img :src="user.url_avatar" id="user_profile_avatar" alt="" />
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
      <div id="user_profile_close_button" v-on:click="showProfile">x</div>
    </div>
  </div>
</template>

<script>
import eventService from "../services/eventService";
import { mapMutations, mapState } from "vuex";

export default {
  computed: {
    ...mapState("game", ["gameInProgress"]),
    ...mapState(["user", "authorized"]),
    ...mapState("profile", ["profile"]),
    winPercent() {
      if (isNaN(this.user.wins / this.user.games)) {
        return 0;
      } else {
        return ((this.user.wins / this.user.games).toFixed(2) * 100).toFixed(0);
      }
    },
  },
  methods: {
    ...mapMutations([
      "SET_NEW_USER_AVATAR",
      "CLOSE_EVENT_SOURCE",
      "SET_ENEMY",
      "SET_AUTHORIZE",
      "SET_USERS",
    ]),
    ...mapMutations("profile", ["SET_PROFILE"]),
    async logout() {
      if (this.gameInProgress) {
        this.$emit("clearLadder");
      }
      this.CLOSE_EVENT_SOURCE();
      await eventService.logout(this.user);
      this.SET_ENEMY(null);
      this.SET_AUTHORIZE(false);
      this.SET_PROFILE(false);
      this.SET_USERS(null);
      await this.$router.push("login");
    },
    showProfile() {
      this.SET_PROFILE(!this.profile);
    },
    async updateAvatar() {
      const avatar = eventService
        .updateAvatar(this.user.login)
        .then(this.getData);
      this.SET_NEW_USER_AVATAR(avatar);
    },
  },
};
</script>

<style scoped>
#user_authorized {
  min-width: 100px;
  min-height: 50px;
  width: 20%;
  height: 10%;
  background-color: crimson;
  position: absolute;
  right: 0;
  top: 0;
}

#user_logout_button {
  width: 30%;
  height: 74%;
  background-color: chocolate;
  position: absolute;
  top: 25%;
  right: 1%;
}

#user_profile_button {
  width: 67%;
  height: 74%;
  background-color: green;
  position: absolute;
  top: 25%;
  left: 1%;
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

#user_profile {
  width: 40%;
  height: 30%;
  background-color: darkviolet;
  position: absolute;
  top: 1%;
  right: 21%;
}

#user_profile_close_button {
  position: absolute;
  top: 1%;
  right: 1%;
  width: 5%;
  height: 12%;
  text-align: center;
  background-color: aqua;
}

#user_profile_avatar {
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
