export const namespaced = true;

export const state = {
  type: "chat",
  show_chat: false,
  info: false,
  user_in_chat: null,
  infoStyle: {
    left: null,
    top: null,
  },
  messages: [],
};

export const mutations = {
  SET_SHOW_CHAT(state, show_chat) {
    state.show_chat = show_chat;
  },
  SET_INFO(state, info) {
    state.info = info;
  },
  SET_INFO_LEFT(state, left) {
    state.infoStyle.left = left;
  },
  SET_INFO_TOP(state, top) {
    state.infoStyle.top = top;
  },
  SET_USER_IN_CHAT(state, user) {
    state.user_in_chat = user;
  },
};
