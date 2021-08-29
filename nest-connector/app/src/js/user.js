// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
chat = require('./chat');
chat = require('./game');

Vue.component('user', {
  template: `<div>
              <chat :authorized="authorized"></chat>
              <game :authorized="authorized"></game>
              <div :class="{ user_authorized: authorized, user_unauthorized: !authorized }">
                <div v-if="authorized">
                    <div class="user_logout_button" v-on:click="authorize"> {{ user_status }}</div>
                    <div class="user_profile_button" v-on:click="showProfile">profile</div>
                </div>
                <div v-else>
                    <div class="user_login_button" v-on:click="authorize"> {{ user_status }}</div>
                </div>
              </div>
              <div v-if="profile" class="user_profile">
                <img :src="avatar" class="user_profile_avatar">
                <div class="user_profile_close_button" v-on:click="showProfile">x</div>
              </div>
             </div>`,
  data() {
    return {
      authorized: false,
      user: 'User',
      user_status: 'login',
      ladder: 'play',
      profile: false,
      wins: 0,
      loses: 0,
      games: 0,
      winP: 0,
      loseP: 0,
      avatar: null,
      id: 5,
    };
  },
  methods: {
    showProfile() {
      if (this.profile) {
        this.profile = false;
      } else {
        this.profile = true;
      }
    },
    authorize() {
      if (this.authorized) {
        this.authorized = false;
        this.profile = false;
        this.user_status = 'login';
      } else {
        this.user_status = 'logout';
        this.authorized = true;
      }
    },
  },
  modules: {
    user: 'chat',
    game: 'game',
  },
  async mounted() {
    this.id = Math.random();
    this.avatar = await axios
      .get('/users/avatar?id=' + this.id)
      .then(function (response) {
        return response.data;
      });
  },
});
