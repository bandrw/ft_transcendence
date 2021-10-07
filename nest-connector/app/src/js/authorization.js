// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');

Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  },
});

Vue.component('user_register', {
  props: {
    authorized: {
      required: true,
      type: Boolean,
    },
    selectedAuth: {
      required: true,
      type: String,
    },
  },
  template: `<div><div id="user_register_login">login: <input v-model="login" type="text"></div>
                    <div id="user_register_pass1">pass: <input v-model="password1" type="password"></div>
                    <div id="user_register_pass2">repeat: <input v-model="password2" type="password"></div>
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
    async creating() {
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
                      this.error = "bad symbol in login: '" + bad[k] + "'";
                      return;
                    }
                  }
                } else {
                  this.error = null;
                  this.$emit('register', this.login);
                  this.login = null;
                }
              }.bind(this),
            );
        }.bind(this),
      );
    },
    async register() {
      if (!this.login) {
        this.error = 'please enter login';
      } else if (!this.password1) {
        this.error = 'please enter password';
      } else if (!this.password2) {
        this.error = 'please enter password again';
      } else if (this.login.length < 4) {
        this.error = 'login too short';
      } else if (this.login.length > 16) {
        this.error = 'login too long';
      } else if (this.password1 !== this.password2) {
        this.error = 'passwords are not equal';
      } else if (this.password1.length < 6) {
        this.error = 'password too short';
      } else if (
        await axios
          .get('/users/checkExist?login=' + this.login)
          .then(function (res) {
            return res.data;
          })
      ) {
        this.error = 'user with the same login already exist';
      } else {
        this.creating();
      }
    },
  },
  mounted() {
    document.addEventListener(
      'keydown',
      function (event) {
        if (event.key === 'Enter') {
          if (!this.authorized && this.selectedAuth === 'registration') {
            this.register();
          }
        }
      }.bind(this),
    );
  },
});

Vue.component('user_login', {
  props: {
    error: {
      required: true,
    },
    authorized: {
      required: true,
      type: Boolean,
    },
    selectedAuth: {
      required: true,
      type: String,
    },
  },
  template: `<div><div id="login_login_text"><p>user > </p></div><div id="login_login_input"><input v-model="login" type="text" class="input" v-focus placeholder="between 4 and 16 symbols"></div>
                    <div id="login_password_text"><p>password ^ </p></div><div id="login_password_input"><input v-model="password" type="password" class="input"  placeholder="6 and more symbols"></div>
                    <div id="login_error"><p v-if="error">error: {{ error }}</p></div>
                    <div class="user_login_button"
                    v-on:click="authorize"><p>login</p></div>
                    <img src="https://yt3.ggpht.com/ytc/AAUvwniWlUa-gZ5YNz8-2Mtada9CZOHaX8o4nGaq5JWc=s900-c-k-c0x00ffffff-no-rj" id="intra_img" alt=""></div>`,
  data() {
    return {
      login: null,
      password: null,
    };
  },
  methods: {
    authorize() {
      this.$emit('authorization', this.login, this.password);
      this.password = '';
    },
  },
  mounted() {
    document.addEventListener(
      'keydown',
      function (event) {
        if (event.key === 'Enter') {
          if (!this.authorized && this.selectedAuth === 'login') {
            this.authorize();
          }
        }
      }.bind(this),
    );
  },
});

Vue.component('wall', {
  props: {
    authorized: {
      required: true,
      type: Boolean,
    },
  },
  template: `<div><span v-for="tab in auth"  class="tab"
                    v-on:click="selectedAuth=tab"
                    v-show="selectedAuth!=='another'"
                    :class="{ active_tab: selectedAuth === tab }">
                    {{ tab }}
                    </span>
                    <user_login v-show="selectedAuth === 'login'"
                    :error="error"
                    :authorized="authorized"
                    :selectedAuth="selectedAuth"
                    @authorization="authorize"></user_login>
                    <user_register
                    :authorized="authorized"
                    :selectedAuth="selectedAuth"
                    v-show="selectedAuth === 'registration'"
                    @register="thankYou"></user_register>
                    <div v-show="selectedAuth === 'another'"
                    id="thank_you"><h4>{{ message }}</h4></div></div>`,
  data() {
    return {
      im: null,
      profile: false,
      error: null,
      auth: ['login', 'registration'],
      selectedAuth: 'login',
      message: null,
      users: null,
    };
  },
  methods: {
    async authorize(login, password) {
      if (!login) {
        this.error = 'please enter login';
        return;
      } else if (!password) {
        this.error = 'please enter password';
        return;
      }
      this.im = await axios
        .post('/users/login', { login: login })
        .then(function (res) {
          return res.data;
        });
      if (this.im) {
        if (bcrypt.compareSync(password, this.im.password)) {
          this.im.password = null;
          this.error = null;
          this.users = await axios
            .get('/users/getOnline')
            .then(function (response) {
              return response.data;
            });
          this.$emit('authSuccess', this.im, this.users);
          this.users = null;
          this.im = null;
        } else {
          this.error = 'Wrong password';
        }
      } else {
        this.error = "User with login '" + login + "' not found";
      }
    },
    thankYou(login) {
      this.selectedAuth = 'another';
      this.message = 'Hello ' + login + '! Thank you for registration';
      setTimeout(
        function () {
          this.selectedAuth = 'login';
        }.bind(this),
        3000,
      );
    },
  },
  modules: {
    user_login: 'user_login',
    user_register: 'user_register',
  },
});
