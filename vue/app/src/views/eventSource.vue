<template>
  <span></span>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState(["eventSource", "users", "user", "enemy"]),
    ...mapState("game", ["you", "enemy", "ball", "starter"]),
  },
  methods: {
    ...mapMutations([
      "ADD_USER",
      "CREATE_EVENT_SOURCE",
      "INCREMENT_USERS_WINS",
      "INCREMENT_USERS_GAMES",
      "INCREMENT_USER_WINS",
      "INCREMENT_USER_GAMES",
      "DEL_USER",
      "SET_ENEMY",
      "SET_ENEMY_READY_STATUS",
    ]),
    ...mapMutations("ladder", ["CLEAR_ACCEPT_INTERVAL", "CLEAR_FIND_INTERVAL"]),
    ...mapMutations("game", [
      "CLEAR_BALL_INTERVAL",
      "SET_ENEMY_WIDTH",
      "SET_ENEMY_SPEED",
      "SET_ID",
      "SET_BALL_POS_X",
      "SET_BALL_POS_Y",
      "SET_GAME_IN_PROGRESS",
      "SET_BALL_SIN",
      "SET_BALL_COS",
    ]),
    addUser(event) {
      const user = JSON.parse(event.data);
      let i = 0;
      while (i < this.users.length) {
        if (this.users[i].login === user.login) {
          break;
        }
        ++i;
      }
      if (i === this.users.length) {
        this.ADD_USER(user);
      }
    },
    updateUserStats(event) {
      const stats = JSON.parse(event.data);
      let i = 0;
      this.INCREMENT_USER_GAMES();
      if (this.user.login === stats.winner) {
        this.INCREMENT_USER_WINS();
      }
      while (i < this.users.length) {
        if (this.users[i].login === stats.winner) {
          this.INCREMENT_USERS_GAMES(i);
          this.INCREMENT_USERS_WINS(i);
        } else if (this.users[i].login === stats.looser) {
          this.INCREMENT_USERS_GAMES(i);
        }
        ++i;
      }
    },
    logoutSSE(event) {
      const user = JSON.parse(event.data);
      let index = 0;
      while (index < this.users.length) {
        if (this.users[index].login === user.login) {
          this.DEL_USER(index);
          return;
        }
        ++index;
      }
    },
    updateUser(event) {
      const user = JSON.parse(event.data);
      let index = 0;
      while (index < this.users.length) {
        if (this.users[index].login === user.login) {
          this.users[index].status = user.status;
          this.users[index].url_avatar = user.url_avatar;
          break;
        }
        ++index;
      }
      if (this.enemy && this.enemy.login === user.login) {
        this.enemy.status = user.status;
        this.enemy.url_avatar = user.url_avatar;
      }
    },
    setEnemy(event) {
      const enemy = JSON.parse(event.data);
      this.SET_ENEMY(enemy);
      this.SET_ENEMY_READY_STATUS("yellow");
    },
    enemyIsReady() {
      this.SET_ENEMY_READY_STATUS("green");
    },
    gameIsReady() {
      this.CLEAR_FIND_INTERVAL();
      this.CLEAR_ACCEPT_INTERVAL();
      this.SET_GAME_IN_PROGRESS(true);
      //fadeOut
    },
    gameSettings(event) {
      const gameSettings = JSON.parse(event.data);
      this.SET_ENEMY_WIDTH(gameSettings.enemyGameSettings.platformWide);
      this.SET_ENEMY_SPEED(gameSettings.enemyGameSettings.platformSpeed);
      this.SET_ID(gameSettings.id);
      this.SET_STARTER(gameSettings.starter);
      if (this.starter) {
        this.SET_BALL_POS_Y(100 - gameSettings.BallPosY);
        this.SET_BALL_POS_X(100 - gameSettings.BallPosX);
      } else {
        this.SET_BALL_POS_Y(gameSettings.BallPosY);
        this.SET_BALL_POS_X(gameSettings.BallPosX);
      }
    },
    ballInAction() {
      if (
          this.ballPosY > 0 &&
          this.ballPosY < 100 &&
          this.ballPosX > 0 &&
          this.ballPosX < 100
      ) {
        this.ballPosY += sin;
        this.ballPosX += cos;
      } else if (this.ballPosX >= 100) {
        cos *= -1;
        this.ballPosX += cos;
      } else if (this.ballPosX <= 0) {
        cos *= -1;
        this.ballPosX += cos;
      } else if (this.ballPosY <= 0) {
        sin *= -1;
        this.ballPosY += sin;
      } else if (this.ballPosY >= 100) {
        sin *= -1;
        this.ballPosY += sin;
      }
    },
    ballLaunch() {
      if (this.starter) {
        this.SET_BALL_SIN(Math.sin(this.ball.angle));
        this.SET_BALL_COS(Math.cos(this.ball.angle));
      } else {
        this.SET_BALL_SIN(-Math.sin(this.ball.angle));
        this.SET_BALL_COS(-Math.cos(this.ball.angle));
      }
      this.interval = setInterval(
          this.ballInAction,
          10,
      );
    },
    },
    listenEvents() {
      this.CREATE_EVENT_SOURCE(this.user.login);
      this.eventSource.addEventListener("login", this.addUser);
      this.eventSource.addEventListener(
        "updateUsersStats",
        this.updateUserStats
      );
      this.eventSource.addEventListener("logout_SSE", this.logoutSSE);
      this.eventSource.addEventListener("updateUser", this.updateUser);
      this.eventSource.addEventListener("enemy", this.setEnemy);
      this.eventSource.addEventListener("enemyIsReady", this.enemyIsReady);
      this.eventSource.addEventListener("gameIsReady", this.gameIsReady);
      this.eventSource.addEventListener("gameSettings", this.gameSettings);
      this.eventSource.addEventListener("ballLaunch", this.ballLaunch);
    },
  },
};
</script>
