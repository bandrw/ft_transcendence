<template>
  <div>
    <div
      id="game_you"
      :style="{ right: youRealPosX + '%', width: this.you.width + '%' }"
    ></div>
    <div
      id="game_enemy"
      :style="{ right: enemyRealPosX + '%', width: this.enemy.width + '%' }"
    ></div>
    <div
      id="game_ball"
      :style="{ right: ballRealPosX + '%', bottom: ballRealPosY + '%' }"
    ></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState("game", ["you", "enemy", "ball", "id"]),
    ...mapState(["socket", "user"]),
    youRealPosX: function () {
      return this.you.posX - this.you.width / 2;
    },
    enemyRealPosX: function () {
      return this.enemy.posX - this.enemy.width / 2;
    },
    ballRealPosY: function () {
      return this.ball.posY - 2;
    },
    ballRealPosX: function () {
      return this.ball.posX - 2;
    },
  },
  methods: {
    ...mapMutations("game", [
      "CLEAR_BALL_INTERVAL",
      "SET_ENEMY_WIDTH",
      "SET_ENEMY_SPEED",
      "SET_ID",
      "SET_BALL_POS_X",
      "SET_BALL_POS_Y",
      "SET_YOU_INTERVAL",
      "ADD_YOU_POS_X",
      "SET_ENEMY_INTERVAL",
    ]),
    platformEvent() {
      const data = JSON.stringify({
        login: this.user.login,
        id: this.id,
        enemyPlatformX: this.you.posX,
      });
      this.socket.emit("platformPosition", data);
    },
    moveRight() {
      if (this.you.posX - 1 - this.you.width / 2 > 0) {
        this.ADD_YOU_POS_X(-1);
        this.platformEvent();
      }
    },
    moveLeft() {
      if (this.youPosX + 1 + this.youWidth / 2 < 100) {
        this.ADD_YOU_POS_X(1);
        this.platformEvent();
      }
    },
    movePlatformRight() {
      if (!this.you.interval) {
        this.SET_YOU_INTERVAL(setInterval(this.moveRight, 15));
      }
    },
    movePlatformLeft() {
      if (!this.enemy.interval) {
        this.SET_ENEMY_INTERVAL(setInterval(this.moveLeft, 15));
      }
    },
  },
};
</script>

<style scoped>
#game_you {
  bottom: 0;
  height: 1%;
  position: absolute;
  background-color: yellow;
}

#game_enemy {
  top: 0;
  height: 1%;
  position: absolute;
  background-color: blue;
}

#game_ball {
  width: 4%;
  height: 4%;
  position: absolute;
  background-color: darkorange;
  border-radius: 50%;
}
</style>
