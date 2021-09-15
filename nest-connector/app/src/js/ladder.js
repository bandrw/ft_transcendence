/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pfile <pfile@student.21-school.ru>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/28 19:10:07 by pfile             #+#    #+#             */
/*   Updated: 2021/09/16 02:32:15 by pfile            ###   ########lyon.fr   */
/*                                                                            */
/* ************************************************************************** */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
Vue.component('ladder', {
  props: {
    authorized: {
      type: Boolean,
      required: true,
    },
    im: {
      type: [Object, Boolean],
      default: null,
      required: false,
    },
    users: {
      required: true,
    },
    enemy: {
      type: [Object, Boolean],
      default: null,
      required: false,
    },
  },
  template: `<div v-on:click="findGame"
                  :class="classGame" class="Jquery_bundle">
                  <div v-if="enemy">
                    <div v-show="readyStatus === 'yellow'" class="accept_button" @click="gameAccept">{{ ladder }}</div>
                    <div class="decline_button" v-on:click="cancelAccept">cancel</div>
                    <div class="timeout">{{ str_timerAccept }}</div>
                    <div id="ladder_you"><img :src="im.url_avatar" width="100%" height="100%"></div>
                    <div id="ladder_ready_you" :style="{ backgroundColor: readyStatus }"></div>
                    <div id="ladder_ready_enemy" :style="{ backgroundColor: enemy.readyStatus }"></div>
                    <div id="ladder_enemy"><img :src="enemy.url_avatar" width="100%" height="100%"></div>
                  </div>
                  <div v-else>
                    <p v-if="authorized">{{ ladder }}
                    <div v-if="gameFinding">{{ str_timerFind }}
                        <div class="cancel" v-on:click="cancelFind">cancel</div>
                    </div>
                  </p>
                  </div></div>`,
  data() {
    return {
      ladder: 'play',
      game: false,
      timerFind: 0,
      str_timerAccept: null,
      timerAccept: 0,
      str_timerFind: null,
      findInterval: null,
      acceptInterval: null,
      breaker: false,
      readyStatus: 'yellow',
    };
  },
  computed: {
    gameFinding: function () {
      return this.game && !this.enemy && this.authorized;
    },
    classGame: function () {
      if (this.authorized) {
        return {
          search_ladder: !this.enemy,
          game_accept: this.enemy,
        };
      }
    },
  },
  methods: {
    gameReady() {
      clearInterval(this.acceptInterval);
      clearInterval(this.findInterval);
    },
    gameAccept() {
      // $('#chat').fadeOut(1000);
      this.readyStatus = 'green';
      axios.get('/ladder/gameStatus?login=' + this.enemy.login + '&status=red');
    },
    clearData(status = 'green') {
      this.game = false;
      this.ladder = 'play';
      this.timerFind = 0;
      this.str_timerFind = null;
      this.timerAccept = 0;
      this.str_timerAccept = null;
      this.findInterval = null;
      this.acceptInterval = null;
      this.breaker = false;
      if (this.im) {
        axios.get(
          '/ladder/gameStatus?login=' + this.im.login + '&status=' + status,
        );
      }
      if (this.enemy) {
        this.$emit('kickEnemy');
      }
    },
    cancelFind(e) {
      clearInterval(this.findInterval);
      this.clearData();
      e.stopPropagation();
    },
    cancelAccept(e) {
      clearInterval(this.acceptInterval);
      clearInterval(this.findInterval);
      this.clearData();
      e.stopPropagation();
    },
    waiting() {
      this.timerAccept = 10;
      this.str_timerAccept = null;
      this.ladder = 'accept';
      this.acceptInterval = setInterval(
        function () {
          if (!this.enemy) {
            clearInterval(this.acceptInterval);
            this.ladder = 'search ...';
            this.breaker = false;
            axios.get('ladder/systemStatus?login=' + this.im.login);
            return;
          }
          if (this.authorized && this.timerAccept > 0.1) {
            this.timerAccept -= 0.1;
            if (this.timerAccept < 3) {
              this.str_timerAccept = this.timerAccept.toFixed(1);
            } else if (this.timerAccept < 7) {
              this.str_timerAccept = this.timerAccept.toFixed(0);
            }
          } else {
            if (this.readyStatus === 'yellow') {
              clearInterval(this.acceptInterval);
              clearInterval(this.findInterval);
              this.clearData('blue');
            } else if (this.readyStatus === 'green') {
              this.$emit('kickEnemy');
              clearInterval(this.acceptInterval);
              this.ladder = 'search ...';
              this.breaker = false;
              axios.get('ladder/systemStatus?login=' + this.im.login);
            }
          }
        }.bind(this),
        100,
      );
    },
    findGame() {
      if (!this.enemy && !this.game) {
        this.game = true;
        this.breaker = false;
        this.timerFind = 0;
        this.str_timerFind = null;
        axios.get(
          '/ladder/gameStatus?login=' + this.im.login + '&status=yellow',
        );
        this.ladder = 'search ...';
        this.findInterval = setInterval(
          function () {
            if (this.authorized) {
              this.timerFind += 0.1;
              this.str_timerFind = this.timerFind.toFixed(1);
              if (this.enemy && !this.breaker) {
                this.breaker = true;
                this.readyStatus = 'yellow';
                this.waiting();
              }
            } else {
              clearInterval(this.findInterval);
              this.clearData();
            }
          }.bind(this),
          100,
        );
      }
    },
  },
});
