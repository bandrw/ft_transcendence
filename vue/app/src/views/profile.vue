<template>
  <div id="user_profile">
    <img :src="user.url_avatar" id="user_profile_avatar" alt="" />
    <b-icon-arrow-clockwise
      scale="3.25"
      shift-v="3.25"
      aria-hidden="true"
      id="user_update_avatar"
      v-on:click="updateAvatar"
    ></b-icon-arrow-clockwise>
    <div id="game_stats">
      <div id="game_stats_count">
        <p>games:</p>
        <p>
          {{ user.games }}
        </p>
      </div>
      <div id="game_stats_wins">
        <p>wins:</p>
        <p>
          {{ user.wins }}
        </p>
      </div>
      <div id="game_stats_winPercent">
        <p>win %:</p>
        <p>{{ winPercent }}</p>
      </div>
    </div>
    <b-icon-x-circle
      id="user_profile_close_button"
      v-on:click="closeProfile"
      aria-hidden="true"
    ></b-icon-x-circle>
    <div id="game_history">
      <div v-for="game in history" :key="game.id">
        <div class="winner_history">
          <p>winner: {{ game.user_one.login }}</p>
          <img :src="game.user_one.url_avatar" alt="" />
        </div>
        <div class="looser_history">
          <p>looser: {{ game.user_two.login }}</p>
          <img :src="game.user_two.url_avatar" alt="" />
        </div>
      </div>
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
    ...mapState("profile", ["profile", "history"]),
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
.winner_history > p {
  color: green;
  /*position: absolute;*/
  left: 15%;
}

.looser_history > p {
  color: red;
  /*position: absolute;*/
  right: 15%;
}

.winner_history > img {
  /*position: absolute;*/
  left: 15%;
  width: 15%;
  height: 15%;
}

.looser_history > img {
  /*position: absolute;*/
  right: 15%;
  width: 15%;
  height: 15%;
}

#game_history {
  position: absolute;
  top: 38%;
  right: 25%;
  width: 50%;
  height: 40%;
  background-color: aqua;
}

p {
  font-weight: bold;
}

#game_stats {
  border: 3px black solid;
  border-radius: 25px;
  position: absolute;
  left: 25%;
  top: 12%;
  height: 20%;
  width: 65%;
  background-color: darkolivegreen;
}

#game_stats_count {
  width: 12%;
  height: 5%;
  right: 15%;
  top: 20%;
  position: absolute;
}

#game_stats_wins {
  width: 12%;
  height: 5%;
  right: 45%;
  top: 20%;
  position: absolute;
}

#game_stats_winPercent {
  width: 12%;
  height: 5%;
  right: 75%;
  top: 20%;
  position: absolute;
}

#user_profile {
  width: 100%;
  height: 100%;
  background-color: beige;
  position: absolute;
}

#user_profile_close_button {
  position: absolute;
  top: 1%;
  right: 1%;
  width: 10%;
  height: 10%;
}

#user_profile_avatar {
  position: absolute;
  left: 1%;
  top: 1%;
  width: 25%;
  height: 25%;
}

#user_update_avatar {
  left: 5%;
  top: 27%;
  position: absolute;
}
</style>
