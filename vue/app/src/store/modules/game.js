export const namespaced = true;

export const state = {
  gameInProgress: false,
  you: {
    posX: 50,
    width: 10,
    speed: 1,
    interval: false,
  },
  enemy: {
    posX: 50,
    width: 10,
    speed: 1,
    interval: false,
  },
  ball: {
    posX: 0,
    posY: 0,
    speed: 0,
    interval: false,
    angle: 0,
  },
  starter: false,
  id: 0,
  // youPosX: 50,
  // youWidth: 10,
  // enemyPosX: 50,
  // enemyWidth: 10,
  // ballPosX: 0,
  // ballPosY: 0,
  // enemySpeed: 1,
  // interval: null,
  // angle: 0,
  // starter: false,
  // id: 0,
  // platformIntervalOne: false,
  // platformIntervalTwo: false,
};

export const mutations = {
  SET_GAME_IN_PROGRESS(state, gameInProgres) {
    state.gameInProgress = gameInProgres;
  },
};
