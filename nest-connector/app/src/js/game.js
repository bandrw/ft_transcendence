/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pfile <pfile@student.21-school.ru>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/28 19:10:07 by pfile             #+#    #+#             */
/*   Updated: 2021/09/12 03:53:03 by pfile            ###   ########lyon.fr   */
/*                                                                            */
/* ************************************************************************** */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
Vue.component('game', {
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
      required: true,
    },
  },
  template: `<div v-on:click="findGame"
                  :class="classGame">
                  <div v-if="enemy">
                    <div class="accept_button">{{ ladder }}</div>
                    <div class="decline_button" v-on:click="cancelAccept">cancel</div>
                    <div class="timeout">{{ str_timerAccept }}</div>
                    <div id="game_you"><img :src="im.url_avatar" width="100%" height="100%"></div>
                    <div id="game_enemy"><img :src="enemy.url_avatar" width="100%" height="100%"></div>
                  </div>
                  <div v-else>
                    <p v-if="authorized">{{ ladder }}
                    <div v-if="gameFinding">{{ str_timerFind }}
                        <div class="cancel" v-on:click="cancelFind">cancel</div>
                    </div>
                  </p>
                  </div>
             </div>`,
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
      } else {
        clearInterval(this.id);
        this.clearData();
      }
    },
  },
  methods: {
    async clearData() {
      this.game = false;
      this.ladder = 'play';
      this.timerFind = 0;
      this.str_timerFind = null;
      this.timerAccept = 0;
      this.str_timerAccept = null;
      this.findInterval = null;
      this.acceptInterval = null;
      this.breaker = false;
      if (this.im.login) {
        await axios.get(
          '/ladder/findGame?login=' + this.im.login + '&status=green',
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
      this.timerAccept = 100;
      this.str_timerAccept = null;
      this.ladder = 'accept';
      this.acceptInterval = setInterval(
        function () {
          if (!this.enemy) {
            clearInterval(this.acceptInterval);
            this.ladder = 'search ...';
            this.breaker = false;
            // this.clearData();
            // this.game = false;
            // this.findGame();
          }
          if (this.authorized && this.timerAccept > 0.1) {
            this.timerAccept -= 0.1;
            if (this.timerAccept < 3) {
              this.str_timerAccept = this.timerAccept.toFixed(1);
            } else if (this.timerAccept < 7) {
              this.str_timerAccept = this.timerAccept.toFixed(0);
            }
          } else {
            clearInterval(this.acceptInterval);
            clearInterval(this.findInterval);
            this.clearData();
          }
        }.bind(this),
        100,
      );
      // clearInterval(this.findInterval);
    },
    findGame() {
      if (!this.enemy && !this.game) {
        this.game = true;
        this.breaker = false;
        axios.get('/ladder/findGame?login=' + this.im.login + '&status=yellow');
        this.ladder = 'search ...';
        this.findInterval = setInterval(
          function () {
            if (this.authorized) {
              this.timerFind += 0.1;
              this.str_timerFind = this.timerFind.toFixed(1);
              if (this.enemy && !this.breaker) {
                this.breaker = true;
                // clearInterval(this.findInterval);
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
