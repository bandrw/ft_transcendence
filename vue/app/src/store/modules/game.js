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
    angle: 45,
    sin: null,
    cos: null,
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
  SET_BALL_INTERVAL(state, interval) {
    state.ball.interval = interval;
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
  ADD_BALL_POS_X(state, add) {
    state.ball.posX += add;
  },
  ADD_BALL_POS_Y(state, add) {
    state.ball.posY += add;
  },
  SET_STARTER(state, starter) {
    state.starter = starter;
  },
  SET_BALL_SIN(state, sin) {
    state.ball.sin = sin;
  },
  SET_BALL_COS(state, cos) {
    state.ball.cos = cos;
  },
  SWAP_SIGN_SIN(state) {
    state.ball.sin *= -1;
  },
  SWAP_SIGN_COS(state) {
    state.ball.cos *= -1;
  },
  SET_ENEMY_POS_X(state, pos) {
    state.enemy.posX = pos;
  },
  SET_YOU_INTERVAL(state, interval) {
    state.you.interval = interval;
  },
  CLEAR_YOU_INTERVAL(state) {
    clearInterval(state.you.interval);
    state.you.interval = false;
  },
  SET_ENEMY_INTERVAL(state, interval) {
    state.enemy.interval = interval;
  },
  CLEAR_ENEMY_INTERVAL(state) {
    clearInterval(state.enemy.interval);
    state.enemy.interval = false;
  },
  ADD_YOU_POS_X(state, pos) {
    state.you.posX += pos;
  },
};
