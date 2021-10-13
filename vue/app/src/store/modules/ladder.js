export const namespaced = true;

export const state = {
  timerFind: 0,
  str_timerFind: null,
  timerAccept: 0,
  str_timerAccept: null,
  findInterval: null,
  acceptInterval: null,
  ladder: "play",
  game: false,
  breaker: false,
  readyStatus: "yellow",
};

export const mutations = {
  CLEAR_ACCEPT_INTERVAL(state) {
    clearInterval(state.acceptInterval);
    state.str_timerAccept = null;
    state.timerAccept = 10;
  },
  CLEAR_FIND_INTERVAL(state) {
    clearInterval(state.findInterval);
    state.str_timerFind = null;
    state.timerFind = 0;
  },
  CLEAR_LADDER(state) {
    state.game = false;
    state.ladder = "play";
    state.breaker = false;
  },
  FIND_TICK(state) {
    state.timerFind += 0.1;
    state.str_timerFind = state.timerFind.toFixed(1);
  },
  ACCEPT_TICK(state) {
    state.timerAccept -= 0.1;
    if (state.timerAccept < 3) {
      state.str_timerAccept = state.timerAccept.toFixed(1);
    } else if (state.timerAccept < 7) {
      state.str_timerAccept = state.timerAccept.toFixed(0);
    }
  },
  SET_READY_STATUS(state, status) {
    state.readyStatus = status;
  },
  SET_GAME(state, game) {
    state.game = game;
  },
  SET_BREAKER(state, breaker) {
    state.breaker = breaker;
  },
  SET_LADDER(state, ladder) {
    state.ladder = ladder;
  },
  SET_FIND_INTERVAL(state, interval) {
    state.findInterval = interval;
  },
  SET_ACCEPT_INTERVAL(state, interval) {
    this.state.acceptInterval = interval;
  },
};
