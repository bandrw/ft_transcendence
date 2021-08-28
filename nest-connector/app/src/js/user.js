chat = require('./chat');
chat = require('./game');

Vue.component('user', {
  template: `<div>
              <chat :authorized="authorized"></chat>
              <game :authorized="authorized"></game>
              <div :class="{ user_authorized: authorized, user_unauthorized: !authorized }">
                <div v-if="authorized">
                    <div class="user_logout_button" v-on:click="authorize"> {{ user_status }}</div>
                    <div class="user_settings_button">settings</div>
                </div>
                <div v-else>
                    <div class="user_login_button" v-on:click="authorize"> {{ user_status }}</div>
                </div>
              </div>
             </div>`,
  data() {
    return {
      authorized: false,
      user: 'User',
      user_status: 'login',
      ladder: 'play',
    };
  },
  methods: {
    authorize() {
      if (this.authorized) {
        this.authorized = false;
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
});
