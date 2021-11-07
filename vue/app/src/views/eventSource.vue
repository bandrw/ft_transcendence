<template>
  <span></span>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import eventService from "../services/eventService";

export default {
  computed: {
    ...mapState(["eventSource", "onlineUsers", "user", "enemy"]),
    ...mapState("game", ["you", "enemy", "ball", "starter"]),
  },
  methods: {
    ...mapMutations("profile", ["UPDATE_USER_AVATAR_IN_HISTORY"]),
    ...mapMutations([
      "ADD_USER",
      "CREATE_EVENT_SOURCE",
      "INCREMENT_USERS_WINS",
      "INCREMENT_USERS_GAMES",
      "INCREMENT_USER_WINS",
      "INCREMENT_USER_GAMES",
      "DEL_USER",
      "SET_ENEMY",
      "SET_USERS_STATUS",
      "SET_USERS_URL_AVATAR",
      "SET_ENEMY_STATUS",
      "SET_ENEMY_URL_AVATAR",
      "SET_USER_STATUS",
      "SET_USER_URL_AVATAR",
    ]),
    ...mapMutations("ladder", [
      "CLEAR_ACCEPT_INTERVAL",
      "CLEAR_FIND_INTERVAL",
      "SET_ENEMY_READY_STATUS",
      "CLEAR_LADDER",
    ]),
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
      "SET_BALL_INTERVAL",
      "ADD_BALL_POS_X",
      "ADD_BALL_POS_Y",
      "SWAP_SIGN_SIN",
      "SWAP_SIGN_COS",
      "SET_ENEMY_POS_X",
      "SET_STARTER",
    ]),
    addUser(event) {
      const user = JSON.parse(event.data);
      let i = 0;
      while (i < this.onlineUsers.length) {
        if (this.onlineUsers[i].login === user.login) {
          break;
        }
        ++i;
      }
      if (i === this.onlineUsers.length) {
        this.ADD_USER(user);
      }
    },
    updateUserStats(event) {
      const stats = JSON.parse(event.data);
      let i = 0;
      if (
        this.user.login === stats.winner ||
        this.user.login === stats.looser
      ) {
        this.INCREMENT_USER_GAMES();
        if (this.user.login === stats.winner) {
          this.INCREMENT_USER_WINS();
        }
      }
      while (i < this.onlineUsers.length) {
        if (this.onlineUsers[i].login === stats.winner) {
          this.INCREMENT_USERS_GAMES(i);
          this.INCREMENT_USERS_WINS(i);
        } else if (this.onlineUsers[i].login === stats.looser) {
          this.INCREMENT_USERS_GAMES(i);
        }
        ++i;
      }
    },
    logoutSSE(event) {
      const user = JSON.parse(event.data);
      let index = 0;
      while (index < this.onlineUsers.length) {
        if (this.onlineUsers[index].login === user.login) {
          this.DEL_USER(index);
          return;
        }
        ++index;
      }
    },
    updateUser(event) {
      const user = JSON.parse(event.data);
      let index = 0;
      while (index < this.onlineUsers.length) {
        if (this.onlineUsers[index].login === user.login) {
          this.SET_USERS_STATUS({
            index: index,
            status: user.status,
          });
          this.SET_USERS_URL_AVATAR({
            index: index,
            url_avatar: user.url_avatar,
          });
          break;
        }
        ++index;
      }
      if (this.user.login === user.login) {
        this.SET_USER_URL_AVATAR(user.url_avatar);
        this.SET_USER_STATUS(user.status);
      }
      if (this.enemy && this.enemy.login === user.login) {
        this.SET_ENEMY_URL_AVATAR(user.url_avatar);
        this.SET_ENEMY_STATUS(user.status);
      }
      this.UPDATE_USER_AVATAR_IN_HISTORY(user);
    },
    setEnemy(event) {
      const enemy = JSON.parse(event.data);
      this.SET_ENEMY(enemy);
      this.SET_ENEMY_READY_STATUS("gameNotAccepted");
    },
    enemyIsReady() {
      this.SET_ENEMY_READY_STATUS("gameAccepted");
    },
    gameIsReady() {
      this.CLEAR_FIND_INTERVAL();
      this.CLEAR_ACCEPT_INTERVAL();
      this.SET_GAME_IN_PROGRESS(true);
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
        this.ball.posY > 0 &&
        this.ball.posY < 100 &&
        this.ball.posX > 0 &&
        this.ball.posX < 100
      ) {
        this.ADD_BALL_POS_Y(this.ball.sin);
        this.ADD_BALL_POS_X(this.ball.cos);
      } else if (this.ballPosX >= 100) {
        this.SWAP_SIGN_COS();
        this.ADD_BALL_POS_X(this.ball.cos);
      } else if (this.ballPosX <= 0) {
        this.SWAP_SIGN_COS();
        this.ADD_BALL_POS_X(this.ball.cos);
      } else if (this.ballPosY <= 0) {
        this.SWAP_SIGN_SIN();
        this.ADD_BALL_POS_Y(this.ball.sin);
      } else if (this.ballPosY >= 100) {
        this.SWAP_SIGN_SIN();
        this.ADD_BALL_POS_Y(this.ball.sin);
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
      this.SET_BALL_INTERVAL(setInterval(this.ballInAction, 10));
    },
    enemyPosition(event) {
      this.SET_ENEMY_POS_X(event.data);
    },
    enemyHasLeaveGame() {
      this.SET_GAME_IN_PROGRESS(false);
      eventService.setStatus(this.user.login);
      this.CLEAR_LADDER();
      this.SET_ENEMY(null);
    },
    listenEvents() {
      this.CREATE_EVENT_SOURCE({
        login: this.user.login,
        socketId: this.user.socketId,
      });
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
      this.eventSource.addEventListener("enemyPosition", this.enemyPosition);
      this.eventSource.addEventListener(
        "enemyHasLeaveGame",
        this.enemyHasLeaveGame
      );
      // this.eventSource.addEventListener("getMessage")
    },
  },
};
</script>
