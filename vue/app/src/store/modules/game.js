export const namespaced = true;

export const state = {
  gameInProgress: false,
  you: {
    posX: 50,
    width: 10,
    speed: 1,
    interval: null,
  },
  enemy: {
    posX: 50,
    width: 10,
    speed: 1,
    interval: null,
  },
  ball: {
    posX: 0,
    posY: 0,
    speed: 0,
    interval: null,
    angle: 0,
  },
  starter: false,
  id: 0,
};

export const mutations = {
  SET_GAME_IN_PROGRESS(state, gameInProgress) {
    state.gameInProgress = gameInProgress;
  },
  CLEAR_BALL_INTERVAL(state) {
    clearInterval(state.ball.interval);
  },
  SET_ENEMY_WIDTH(state, width) {
    state.enemy.width = width;
  },
  SET_ENEMY_SPEED(state, speed) {
    state.enemy.speed = speed;
  },
  SET_ID(state, id) {
    state.id = id;
  },
  SET_BALL_POS_X(state, posX) {
    state.ball.posX = posX;
  },
  SET_BALL_POS_Y(state, posY) {
    state.ball.posY = posY;
  },
  SET_STARTER(state, starter) {
    state.starter = starter;
  },
};
