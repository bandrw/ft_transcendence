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
    <h3 id="history_label">match history:</h3>
    <b-button
      id="leftHistoryButton"
      v-show="showButtonLeft"
      @click="decrementPage"
      ><b-icon-arrow-bar-left></b-icon-arrow-bar-left
    ></b-button>
    <b-button
      id="rightHistoryButton"
      v-show="showButtonRight"
      @click="incrementPage"
      ><b-icon-arrow-bar-right></b-icon-arrow-bar-right
    ></b-button>
    <table id="game_history">
      <tr>
        <th class="user"><p>winner</p></th>
        <th class="score"><p>score</p></th>
        <th class="user"><p>looser</p></th>
        <th class="score"><p>score</p></th>
      </tr>
      <tr
        v-for="game in this.currentPageInHistory"
        :key="game.id"
        :style="{
          'background-color':
            game.user_one.login === user.login ? 'yellowgreen' : 'orangered',
          game,
        }"
      >
        <td class="user">
          <p>{{ game.user_one.login }}</p>
          <img
            :src="game.user_one.url_avatar"
            alt=""
            class="game_history_avatar"
          />
        </td>
        <td class="score">
          <p>{{ game.score_one }}</p>
        </td>
        <td class="user">
          <p>{{ game.user_two.login }}</p>
          <img
            :src="game.user_two.url_avatar"
            alt=""
            class="game_history_avatar"
          />
        </td>
        <td class="score">
          <p>{{ game.score_two }}</p>
        </td>
      </tr>
    </table>
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
      "rowsPerPage",
    ]),
    page() {
      return this.arrayPage + 1;
    },
    showButtonRight() {
      return this.rowsPerPage * this.page < this.history.length;
    },
    showButtonLeft() {
      return this.page > 1;
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
.user {
  width: 35%;
}
.score {
  width: 15%;
}

#leftHistoryButton {
  left: 40%;
  top: 40%;
  position: absolute;
}

#rightHistoryButton {
  right: 43%;
  top: 40%;
  position: absolute;
}

td > p {
  left: 10%;
  position: relative;
}

td > img {
  left: 15%;
}

#history_label {
  top: 37%;
  left: 17%;
  position: absolute;
}

td {
  position: relative;
  border-right: 1px solid black;
}

table {
  border-collapse: collapse;
  border: 1px solid black;
  text-align: center;
  vertical-align: center;
}

th {
  background-color: darkolivegreen;
  border-right: 1px solid black;
}

#user_login {
  text-align: center;
  top: 3%;
  left: 50%;
  position: absolute;
}

.game_history_avatar {
  width: 45px;
  height: 45px;
  left: 10%;
  top: 7%;
  position: absolute;
}

#game_history {
  position: absolute;
  top: 45%;
  left: 25%;
  width: 45%;
  height: 40%;
}

p {
  font-weight: bold;
  font-size: small;
}

#game_stats {
  border: 3px black solid;
  border-radius: 12px;
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
