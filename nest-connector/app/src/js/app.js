let app = new Vue({
  el: '#app',
  data: {
    type: 'Chat',
    user: 'User',
    user_status: 'login',
    authorized: false,
    show_chat: false,
    user_class: 'user_unauthorized',
    chat_state: 'chat_closed',
    ladder: 'play',
    find_game: false,
    users: [
      {
        name: 'Mark',
        id: 1,
        game_status: false,
        online: true,
      },
      {
        name: 'Ivan',
        id: 2,
        game_status: false,
        online: false,
      },
    ],
  },
  methods: {
    authorize() {
      if (this.authorized) {
        this.authorized = false;
        this.show_chat = false;
        this.find_game = false;
        this.user_status = 'login';
      } else {
        this.user_status = 'logout';
        this.authorized = true;
      }
    },
    findGame() {
      if (this.find_game) {
        this.ladder = 'play';
        this.find_game = false;
      } else {
        this.ladder = 'finding game';
        this.find_game = true;
      }
    },
    showChat() {
      if (this.show_chat) {
        this.show_chat = false;
      } else {
        this.show_chat = true;
      }
    },
  },
});
