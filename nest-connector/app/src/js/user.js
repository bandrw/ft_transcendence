// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
chat = require('./chat');
chat = require('./game');
// eslint-disable-next-line @typescript-eslint/no-var-requires
var bcrypt = require('bcryptjs');

Vue.component('user_register', {
  template: `<div><div id="user_register_login">login: <input v-model="login" type="text"
                    v-on:keyup.enter="register"></div>
                    <div id="user_register_pass1">pass: <input v-model="password1" type="password"
                    v-on:keyup.enter="register"></div>
                    <div id="user_register_pass2">repeat: <input v-model="password2" type="password"
                    v-on:keyup.enter="register"></div>
                    <p v-if="error" id="user_register_error_message">error: {{ error }}</p>
                    <div class="user_login_button"
                    v-on:click="register">login</div>
                    </div>`,
  data() {
    return {
      error: null,
      password1: null,
      password2: null,
      login: null,
    };
  },
  methods: {
    creating() {
      bcrypt.hash(
        this.password1,
        10,
        async function (err, hash) {
          this.password1 = null;
          this.password2 = null;
          await axios
            .post('/users/create', {
              pass: hash,
              login: this.login,
            })
            .then(
              function (res) {
                const bad = ' /|;<>&?:{}[]()';
                if (res.data.length === 1) {
                  for (let k = 0; k < bad.length; k++) {
                    if (res.data === bad[k]) {
                      this.error = "bad symbol: '" + bad[k] + "'";
                      return;
                    }
                  }
                } else {
                  this.error = null;
                  console.log(res.data);
                }
              }.bind(this),
            );
        }.bind(this),
      );
    },
    async register() {
      if (!this.login || this.login.length < 4) {
        this.error = 'login too short';
      } else if (this.password1 !== this.password2) {
        this.error = 'passwords are not equal';
      } else if (!this.password1 || this.password1.length < 6) {
        this.error = 'password too short';
      } else if (
        await axios.post('/users/' + this.login).then(function (res) {
          return res.data;
        })
      ) {
        this.error = 'user with the same login already exist';
      } else {
        this.creating();
      }
    },
  },
});

Vue.component('user_login', {
  props: {
    error: {
      type: Boolean,
      required: true,
    },
  },
  template: `<div style="margin-left: 5%">login: <input v-model="login" type="text" class="input"
                    v-on:keyup.enter="authorize"><br>
                    pass: <input v-model="password" type="password" class="input"
                    v-on:keyup.enter="authorize">
                    <p v-if="error">error!</p>
                    <div class="user_login_button"
                    v-on:click="authorize">login</div>
                    <img src="https://yt3.ggpht.com/ytc/AAUvwniWlUa-gZ5YNz8-2Mtada9CZOHaX8o4nGaq5JWc=s900-c-k-c0x00ffffff-no-rj" id="intra_img"></div>`,
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
                    <span v-for="tab in auth"  class="tab"
                    v-on:click="selectedAuth=tab"
                    
                    :class="{ active_tab: selectedAuth === tab }">
                    {{ tab }}
                    </span>
                    <user_login v-show="selectedAuth === 'login'"
                    :error="error" @authorization="authorize"></user_login>
                    <user_register v-show="selectedAuth === 'registration'"></user_register>
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
      auth: ['login', 'registration'],
      selectedAuth: 'login',
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
