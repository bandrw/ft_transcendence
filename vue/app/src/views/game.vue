<template>
  <div id="game">
<!--    <div
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
    ></div>-->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import * as Matter from "matter-js";

export default {
  data() {
    return {
      engine: null,
      runner: null,
      render: null,
      circle: null,
    };
  },
  computed: {
    ...mapState("game", ["you", "enemy", "ball", "id"]),
    ...mapState(["user"]),
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
      "SET_LEFT_INTERVAL",
      "ADD_YOU_POS_X",
      "SET_RIGHT_INTERVAL",
    ]),
    platformEvent() {
      const data = JSON.stringify({
        login: this.user.login,
        id: this.id,
        enemyPlatformX: this.you.posX,
      });
      this.$socket.emit("platformPosition", data);
    },
    moveRight() {
      if (this.you.posX - 1 - this.you.width / 2 > 0) {
        this.ADD_YOU_POS_X(-1);
        this.platformEvent();
      }
    },
    moveLeft() {
      if (this.you.posX + 1 + this.you.width / 2 < 100) {
        this.ADD_YOU_POS_X(1);
        this.platformEvent();
      }
    },
    movePlatformRight() {
      if (!this.you.rightInterval) {
        this.SET_RIGHT_INTERVAL(setInterval(this.moveRight, 15));
      }
    },
    movePlatformLeft() {
      if (!this.you.leftInterval) {
        this.SET_LEFT_INTERVAL(setInterval(this.moveLeft, 15));
      }
    },
  },
  mounted() {
    this.engine = Matter.Engine.create();
      // this.render = Matter.Render.create({
      //   element: document.getElementById("game"),
      // });
      // Matter.Render.run(this.render);
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
    // this.circle = Matter.Bodies.circle(200, 200, 150);
  },
  beforeDestroy() {
    Matter.Engine.clear(this.engine);
    Matter.Runner.stop(this.runner);
  },
};
</script>

<style scoped>
#game {
  width: 100%;
  height: 100%;
  position: absolute;
}

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
