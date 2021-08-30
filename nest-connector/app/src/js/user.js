// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
chat = require('./chat');
chat = require('./game');

Vue.component('user_login', {
  props: {
    error: {
      type: Boolean,
      required: true,
    },
  },
  template: `<div><input v-model="login" type="text" 
                    v-on:keyup.enter="authorize">
                    <input v-model="password" type="password"
                    v-on:keyup.enter="authorize">
                    <p v-if="error">error!</p>
                    <div class="user_login_button"
                    v-on:click="authorize">login</div></div>`,
  data() {
    return {
      login: null,
      password: null,
    };
  },
  methods: {
    authorize() {
      this.$emit('authorization', this.login, this.password);
    },
  },
});

Vue.component('user', {
  template: `<div>
              <chat :authorized="authorized" :im="im"></chat>
              <game :authorized="authorized"></game>
              <div :class="{ user_authorized: authorized, user_unauthorized: !authorized }">
                <div v-if="authorized">
                    <div class="user_logout_button" v-on:click="authorize">logout</div>
                    <div class="user_profile_button" v-on:click="showProfile">{{ im.login }}</div>
                </div>
                <div v-else>
                    <user_login :error="error" @authorization="authorize"></user_login>
                </div>
              </div>
              <div v-if="profile" class="user_profile">
                <img :src="im.url_avatar" class="user_profile_avatar">
                <div id="user_update_avatar" v-on:click="updateAvatar"></div>
                <div class="user_profile_close_button" v-on:click="showProfile">x</div>
              </div>
             </div>`,
  data() {
    return {
      authorized: false,
      user: 'User',
      ladder: 'play',
      profile: false,
      winP: 0,
      loseP: 0,
      error: false,
      im: null,
      auth: ['authorization', 'registration'],
    };
  },
  methods: {
    async updateAvatar() {
      this.im.url_avatar = await axios
        .get('/users/avatar?login=' + this.im.login)
        .then(function (res) {
          return res.data;
        });
    },
    showProfile() {
      if (this.profile) {
        this.profile = false;
      } else {
        this.profile = true;
      }
    },
    async authorize(login, password) {
      if (this.authorized) {
        this.authorized = false;
        this.profile = false;
        this.login = null;
        this.error = false;
      } else {
        this.im = await axios.post('/users/' + login).then(function (res) {
          return res.data;
        });
        if (this.im) {
          this.authorized = true;
        } else {
          this.error = true;
        }
      }
    },
  },
  modules: {
    user: 'chat',
    game: 'game',
  },
});
