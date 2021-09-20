Vue.component('game', {
  template: `<div>
   <div id="game_you" :style="{ right: youRealPosX + '%', width: youWidth + '%' }"></div>
   <div id="game_enemy" :style="{ right: enemyRealPosX + '%', width: enemyWidth + '%' }"></div>
   <div id="game_ball" :style="{ right: ballRealPosX + '%' , bottom: ballRealPosY + '%' }"></div>
</div>`,
  data() {
    return {
      youPosX: 50,
      youWidth: 10,
      enemyPosX: 50,
      enemyWidth: 10,
      ballPosX: 0,
      ballPosY: 0,
      enemySpeed: 1,
    };
  },
  computed: {
    youRealPosX: function () {
      return this.youPosX - this.youWidth / 2;
    },
    enemyRealPosX: function () {
      return this.enemyPosX - this.enemyWidth / 2;
    },
    ballRealPosY: function () {
      return this.ballPosY - 2;
    },
    ballRealPosX: function () {
      return this.ballPosX - 2;
    },
  },
  methods: {
    setSettings: function (gameSettings) {
      this.enemyWidth = gameSettings.enemyGameSettings.platformWide;
      this.enemySpeed = gameSettings.enemyGameSettings.platformSpeed;
      if (gameSettings.starter) {
        this.ballPosY = gameSettings.BallPosY;
        this.ballPosX = gameSettings.BallPosX;
      } else {
        this.ballPosY = 100 - gameSettings.BallPosY;
        this.ballPosX = 100 - gameSettings.BallPosX;
      }
    },
  },
});
