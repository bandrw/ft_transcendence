<template>
  <div id="user_profile">
    <img :src="user.url_avatar" id="user_profile_avatar" alt="" />
    <h4 id="user_login">{{ user.login }}</h4>
    <b-icon-arrow-clockwise
      scale="2"
      shift-v="2"
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
    <table id="game_history">
      <tr>
        <th colspan="2"><p>winner</p></th>
        <th><p>score</p></th>
        <th colspan="2"><p>looser</p></th>
        <th><p>score</p></th>
      </tr>
      <tr v-for="game in this.currentPageInHistory" :key="game.id">
        <td>
          <p>{{ game.user_one.login }}</p>
        </td>
        <td>
          <img
            :src="game.user_one.url_avatar"
            alt=""
            class="game_history_avatar"
          />
        </td>
        <td>
          <p>{{ game.score_one }}</p>
        </td>
        <td>
          <img
            :src="game.user_two.url_avatar"
            alt=""
            class="game_history_avatar"
          />
        </td>
        <td>
          <p>{{ game.user_two.login }}</p>
        </td>
        <td>
          <p>{{ game.score_two }}</p>
        </td>
      </tr>
    </table>
    <div>
      <p id="current_page">current page: {{ this.page }}</p>
      <b-button-group id="history_buttons">
        <b-button @click="decrementPage"><p>left</p></b-button>
        <b-button @click="incrementPage"><p>right</p></b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script>
import eventService from "../services/eventService";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  props: ["username"],
  computed: {
    ...mapState("game", ["gameInProgress"]),
    ...mapState(["user", "authorized"]),
    ...mapState("profile", [
      "profile",
      "currentPageInHistory",
      "arrayPage",
      "history",
    ]),
    page() {
      return this.arrayPage + 1;
    },
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
    ...mapActions("profile", ["updatePageFromHistory"]),
    decrementPage() {
      this.updatePageFromHistory(this.page - 1);
    },
    incrementPage() {
      this.updatePageFromHistory(this.page + 1);
    },
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
  mounted() {
    this.updatePageFromHistory(1);
  },
};
</script>

<style scoped>
#current_page {
  text-align: center;
  right: 35%;
  top: 80%;
  position: absolute;
}

table,
th,
td {
  border: 2px solid beige;
  border-radius: 15px;
}

#user_login {
  text-align: center;
  top: 5%;
}

.game_history_avatar {
  width: 25%;
  height: 25%;
}

#game_history {
  position: absolute;
  top: 38%;
  left: 1%;
  width: 69%;
  height: 40%;
  background-color: aqua;
}

#history_buttons {
  position: absolute;
  top: 84%;
  left: 45%;
  width: 25%;
  height: 5%;
  background-color: aqua;
}

p {
  font-weight: bold;
  font-size: small;
}

#game_stats {
  border: 3px black solid;
  border-radius: 25px;
  position: absolute;
  left: 25%;
  top: 12%;
  height: 20%;
  width: 45%;
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
  width: 9%;
  height: 9%;
}

#user_profile_avatar {
  position: absolute;
  left: 1%;
  top: 1%;
  width: 24%;
  height: 24%;
}

#user_update_avatar {
  left: 5%;
  top: 27%;
  position: absolute;
}
</style>
