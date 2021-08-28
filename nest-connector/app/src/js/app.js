// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
chat = require('./chat');

new Vue({
  el: '#app',
  data: {
    authorized: false,
    user: 'User',
    user_status: 'login',
    ladder: 'play',
    find_game: false,
  },
  methods: {
    authorize() {
      if (this.authorized) {
        this.authorized = false;
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
  },
  modules: {
    chat: 'chat',
  },
  mounted() {
    console.log('vue app mounted');
  },
});
