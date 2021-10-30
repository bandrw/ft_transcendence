export const namespaced = true;

export const state = {
  gameInProgress: false,
  you: {
    posX: 50,
    width: 10,
    speed: 1,
    leftInterval: null,
    rightInterval: null,
  },
  enemy: {
    posX: 50,
    width: 10,
    speed: 1,
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
  SET_LEFT_INTERVAL(state, interval) {
    state.you.leftInterval = interval;
  },
  CLEAR_LEFT_INTERVAL(state) {
    clearInterval(state.you.leftInterval);
    state.you.leftInterval = false;
  },
  SET_RIGHT_INTERVAL(state, interval) {
    state.you.rightInterval = interval;
  },
  CLEAR_RIGHT_INTERVAL(state) {
    clearInterval(state.you.rightInterval);
    state.you.rightInterval = false;
  },
  ADD_YOU_POS_X(state, pos) {
    state.you.posX += pos;
  },
};
