<template>
  <div id="user_profile">
    <div>
      <img :src="user.url_avatar" id="user_profile_avatar" alt="" />
      <div id="user_update_avatar" v-on:click="updateAvatar"></div>
      <div id="game_stats_count">
        <p>games: {{ user.games }}</p>
      </div>
      <div id="game_stats_wins">
        <p>wins: {{ user.wins }}</p>
      </div>
      <div id="game_stats_winPercent">
        <p>win percent: {{ winPercent }}%</p>
      </div>
      <div id="user_profile_close_button" v-on:click="closeProfile">x</div>
    </div>
  </div>
</template>

<script>
import eventService from "../services/eventService";
import { mapMutations, mapState } from "vuex";

export default {
  props: ["username"],
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
    closeProfile() {
      this.SET_PROFILE(!this.profile);
      this.$router.push({ name: "main" });
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
  width: 100%;
  height: 100%;
  background-color: darkviolet;
  position: absolute;
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
