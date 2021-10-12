<template>
  <div v-on:click="findGame" :id="idGame" class="Jquery_bundle">
    <div v-if="enemy">
      <div
        v-show="readyStatus === 'yellow'"
        id="accept_button"
        @click="gameAccept"
      >
        {{ ladder }}
      </div>
      <div id="decline_button" v-on:click="cancelAccept">cancel</div>
      <div id="timeout">{{ str_timerAccept }}</div>
      <div id="ladder_you">
        <img :src="user.url_avatar" width="100%" height="100%" alt="" />
      </div>
      <div
        id="ladder_ready_you"
        :style="{ backgroundColor: readyStatus }"
      ></div>
      <div
        id="ladder_ready_enemy"
        :style="{ backgroundColor: enemy.readyStatus }"
      ></div>
      <div id="ladder_enemy">
        <img :src="enemy.url_avatar" width="100%" height="100%" alt="" />
      </div>
    </div>
    <div v-else>
      <p v-if="authorized">{{ ladder }}</p>
      <div v-if="gameFinding">
        {{ str_timerFind }}
        <div id="cancel" v-on:click="cancelFind">cancel</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import eventService from "../services/eventService";

export default {
  computed: {
    ...mapState(["enemy", "user", "authorized"]),
    ...mapState("ladder", [
      "game",
      "ladder",
      "breaker",
      "readyStatus",
      "timerAccept",
      "str_timerAccept",
      "str_timerFind",
    ]),
    idGame: function () {
      return {
        search_ladder: !this.enemy,
        game_accept: this.enemy,
      };
    },
  },
  methods: {
    ...mapMutations("ladder", [
      "CLEAR_ACCEPT_INTERVAL",
      "CLEAR_FIND_INTERVAL",
      "CLEAR_LADDER",
      "FIND_TICK",
      "PRE_ACCEPT",
      "SET_GAME",
      "SET_BREAKER",
      "SET_LADDER",
      "SET_FIND_INTERVAL",
      "ACCEPT_TICK",
    ]),
    ...mapMutations(["SET_ENEMY"]),
    // ...mapActions("ladder", ["clearIntervals", "reset"]),
    ...mapState(["enemy", "user"]),
    clearIntervals: function () {
      this.CLEAR_ACCEPT_INTERVAL();
      this.CLEAR_FIND_INTERVAL();
    },
    clearLadder: function (status = "green") {
      this.CLEAR_LADDER();
      eventService.setStatus(this.user.login, status);
    },
    clearData: function (status = "green") {
      this.clearIntervals();
      this.clearLadder(status);
      this.SET_ENEMY(null);
    },
    cancelFind(e) {
      this.CLEAR_FIND_INTERVAL();
      this.clearLadder();
      e.stopPropagation();
    },
    cancelAccept(e) {
      this.clearData();
      e.stopPropagation();
    },
    findChecker: function () {
      if (this.authorized) {
        this.FIND_TICK();
        if (this.enemy && !this.breaker) {
          this.PRE_ACCEPT();
          this.waiting();
        }
      } else {
        this.CLEAR_FIND_INTERVAL();
        this.CLEAR_LADDER();
      }
    },
    findGame() {
      if (!this.enemy && !this.game) {
        this.SET_GAME(true);
        this.SET_BREAKER(false);
        eventService.setStatus(this.user.login, "yellow");
        this.SET_LADDER("search ...");
        this.SET_FIND_INTERVAL(setInterval(this.findChecker, 100));
      }
    },
    backToSearch() {
      this.CLEAR_ACCEPT_INTERVAL();
      this.SET_LADDER("search...");
      this.SET_BREAKER(false);
      eventService.systemStatus(this.user.login);
    },
    acceptChecker() {
      if (!this.enemy) {
        this.backToSearch();
        return;
      }
      if (this.authorized && this.timerAccept > 0.1) {
        this.ACCEPT_TICK();
      } else {
        if (this.readyStatus === "yellow") {
          this.clearData("blue");
        } else if (this.readyStatus === "green") {
          this.SET_ENEMY(false);
          this.backToSearch();
        }
      }
    },
    waiting() {
      this.SET_LADDER("accept");
      this.acceptInterval = setInterval(this.acceptChecker, 100);
    },
  },
};
</script>

<style scoped>
#search_ladder {
  width: 20%;
  height: 15%;
  background-color: darkviolet;
  position: absolute;
  right: 0;
  bottom: 0;
}

#game_accept {
  width: 35%;
  height: 30%;
  background-color: chartreuse;
  position: absolute;
  right: 33%;
  bottom: 35%;
}

#cancel {
  width: 25%;
  height: 25%;
  background-color: red;
  position: absolute;
  right: 10%;
  bottom: 10%;
}

#accept_button {
  width: 25%;
  height: 25%;
  background-color: green;
  position: absolute;
  right: 37%;
  bottom: 10%;
}

#decline_button {
  width: 15%;
  height: 12%;
  background-color: red;
  position: absolute;
  top: 1%;
  right: 1%;
}

#timeout {
  width: 10%;
  height: 15%;
  background-color: gold;
  text-align: center;
  position: absolute;
  top: 10%;
  right: 45%;
}

#ladder_you {
  width: 20%;
  height: 40%;
  background-color: aliceblue;
  text-align: center;
  position: absolute;
  left: 10%;
  top: 30%;
}

#ladder_enemy {
  width: 20%;
  height: 40%;
  background-color: aliceblue;
  text-align: center;
  position: absolute;
  right: 10%;
  top: 30%;
}

#ladder_ready_you {
  width: 8%;
  height: 16%;
  text-align: center;
  position: absolute;
  left: 17%;
  top: 75%;
}

#ladder_ready_enemy {
  width: 8%;
  height: 16%;
  text-align: center;
  position: absolute;
  right: 17%;
  top: 75%;
}
</style>
