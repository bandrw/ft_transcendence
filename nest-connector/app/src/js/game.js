Vue.component('game', {
  // props: {
  //   initBallPosX: {
  //     type: Number,
  //     required: true,
  //   },
  // },
  template: `<div>
   <div id="game_you" :style="{ right: youPosX + '%', width: youWidth + '%' }"></div>
   <div id="game_enemy" :style="{ right: enemyPosX + '%', width: enemyWidth + '%' }"></div>
   <div id="game_ball" :style="{ right: ballPosX + '%' , bottom: ballPosY + '%' }"></div>
</div>`,
  data() {
    return {
      youPosX: 50,
      youWidth: 10,
      enemyPosX: 50,
      enemyWidth: 10,
      ballPosX: 50,
      ballPosY: 1,
    };
  },
});
