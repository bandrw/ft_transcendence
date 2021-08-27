// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
chat = require('./chat');

new Vue({
  el: '#app',
  data: {
    authorized: false,
    show_chat: false,
    user: 'User',
    user_status: 'login',
    user_class: 'user_unauthorized',
    ladder: 'play',
    find_game: false,
    get_users: null,
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
  },
  modules: {
    chat: 'chat',
  },
  mounted() {
    axios
      .get('/users/get')
      .then(function (response) {
        console.log('resp:');
        this.get_users = 'response';
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
});
