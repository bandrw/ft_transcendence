// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
chat = require('./chat');
ladder = require('./ladder');
wall = require('./authorization');
game = require('./game');
io = require('socket.io/client-dist/socket.io');

Vue.component('user', {
  template: `<div>
              <game v-show="gameR" ref="game"></game>
              <div @login="addUser"></div>
                <chat :authorized="authorized" :im="im" :users="users"
                ref="chat" :gameR="gameR"></chat>
              <ladder :authorized="authorized" @kickEnemy="enemy = false"
               :im="im" :users="users" :enemy="enemy"
              ref="ladder"></ladder>
              <div class="Jquery_bundle" :class="{ user_authorized: authorized, user_unauthorized: !authorized }">
                <div v-show="authorized">
                    <div class="user_logout_button" v-on:click="logout">logout</div>
                    <div class="user_profile_button" v-on:click="showProfile">{{ im.login }}</div>
                </div>
                <wall v-show="!authorized" @authSuccess="authSuccess" @logout="logout" :authorized="authorized"></wall>
              </div>
              <div v-show="profile && authorized && !gameR" class="user_profile">
                <img :src="im.url_avatar" class="user_profile_avatar">
                <div id="user_update_avatar" v-on:click="updateAvatar"></div>
                <div class="user_profile_close_button" v-on:click="showProfile">x</div>
              </div>
             </div>`,
  data() {
    return {
      authorized: false,
      profile: false,
      winP: 0,
      games: 0,
      im: false,
      users: null,
      eventSource: null,
      enemy: false,
      gameR: false,
    };
  },
  methods: {
    addUser() {
      this.users.push(this.eventSource.data);
    },
    async logout() {
      if (this.$refs.ladder.game) {
        if (this.$refs.ladder.enemy) {
          clearInterval(this.$refs.ladder.acceptInterval);
          clearInterval(this.$refs.ladder.findInterval);
          this.$refs.ladder.clearData();
        } else {
          clearInterval(this.$refs.ladder.findInterval);
          this.$refs.ladder.clearData();
        }
      }
      this.eventSource.close();
      await axios.post('/users/logout', { user: this.im });
      this.enemy = false;
      this.authorized = false;
      this.profile = false;
      this.users = null;
      this.im = false;
    },
    authSuccess(im, users) {
      this.im = im;
      this.eventSource = new EventSource('/users/login?login=' + this.im.login);
      this.eventSource.addEventListener('login', (event) => {
        const user = JSON.parse(event.data);
        if (
          this.users
            .map(function (e) {
              return e.login;
            })
            .indexOf(user.login) === -1
        )
          this.users.push(user);
      });
      this.eventSource.addEventListener('logout_SSE', (event) => {
        const user = JSON.parse(event.data);
        if (
          this.users
            .map(function (e) {
              return e.login;
            })
            .indexOf(user.login) !== -1
        ) {
          let index = 0;
          while (index < this.users.length) {
            if (this.users[index].login === user.login) {
              break;
            }
            ++index;
          }
          this.users.splice(index, 1);
        }
      });
      this.eventSource.addEventListener('updateUser', (event) => {
        const user = JSON.parse(event.data);
        if (
          this.users
            .map(function (e) {
              return e.login;
            })
            .indexOf(user.login) !== -1
        ) {
          let index = 0;
          while (index < this.users.length) {
            if (this.users[index].login === user.login) {
              this.users[index].status = user.status;
              this.users[index].url_avatar = user.url_avatar;
              break;
            }
            ++index;
          }
          if (this.enemy && this.enemy.login === user.login) {
            this.enemy.status = user.status;
            this.enemy.url_avatar = user.url_avatar;
          }
        }
      });
      this.eventSource.addEventListener('enemy', (event) => {
        this.enemy = JSON.parse(event.data);
        this.enemy.readyStatus = 'yellow';
      });
      this.eventSource.addEventListener('enemyIsReady', () => {
        this.enemy.readyStatus = 'green';
      });
      this.eventSource.addEventListener('gameIsReady', () => {
        this.$refs.ladder.gameReady();
        $('.Jquery_bundle').fadeOut(1000);
        this.gameR = true;
      });
      this.eventSource.addEventListener('gameSettings', (event) => {
        const gameSettings = JSON.parse(event.data);
        this.$refs.game.setSettings(gameSettings);
      });
      this.users = users;
      this.authorized = true;
    },
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
  },
  modules: {
    user: 'chat',
    ladder: 'ladder',
    wall: 'wall',
    game: 'game',
  },
  mounted() {
    this.socket = io('http://localhost:3000');
    window.onbeforeunload = function () {
      if (this.authorized) {
        this.logout();
      }
    }.bind(this);
    document.addEventListener(
      'keydown',
      function (event) {
        if (event.key === 'Escape') {
          if (
            this.$refs.ladder &&
            this.authorized &&
            !this.$refs.ladder.game &&
            !this.enemy
          ) {
            this.logout();
          } else if (
            this.$refs.ladder &&
            this.authorized &&
            this.$refs.ladder.game
          ) {
            if (!this.enemy) {
              this.$refs.ladder.cancelFind(event);
            } else if (this.enemy && !this.gameR) {
              this.$refs.ladder.cancelAccept(event);
            } else if (this.enemy && this.gameR) {
              $('.Jquery_bundle').fadeIn(1000);
              this.gameR = false;
              this.$refs.ladder.clearData('blue');
            }
          }
        } else if (event.key === 'Enter') {
          if (this.authorized && !this.$refs.ladder.game && !this.enemy) {
            this.$refs.ladder.findGame();
          } else if (
            this.authorized &&
            this.$refs.ladder.game &&
            this.enemy &&
            !this.gameR
          ) {
            this.$refs.ladder.gameAccept();
          }
        } else if (event.key === 'Tab' && this.authorized) {
          event.preventDefault();
          this.showProfile();
        } else if (event.key === ' ' && this.authorized) {
          if (this.gameR) {
            this.socket.emit('start', JSON.stringify(this.im));
          } else {
            this.$refs.chat.showChat();
          }
        }
      }.bind(this),
    );
  },
});
