/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pfile <pfile@student.21-school.ru>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/28 19:10:07 by pfile             #+#    #+#             */
/*   Updated: 2021/08/29 02:43:43 by pfile            ###   ########lyon.fr   */
/*                                                                            */
/* ************************************************************************** */
Vue.component('game', {
  props: {
    authorized: {
      type: Boolean,
      required: true,
    },
  },
  template: `<div v-on:click="findGame"
                  :class="classGame">
                  <div v-if="enemy">
                    <div class="accept_button">{{ ladder }}</div>
                    <div class="decline_button" v-on:click="cancel">cancel</div>
                    <div class="timeout">{{ str_timer }}</div>
                  </div>
                  <div v-else>
                    <p v-if="authorized">{{ ladder }}
                    <div v-if="gameFinding">{{ str_timer }}
                        <div class="cancel" v-on:click="cancel">cancel</div>
                    </div>
                  </p>
                  </div>
             </div>`,
  data() {
    return {
      ladder: 'play',
      game: false,
      enemy: false,
      timer: 0,
      str_timer: null,
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
    clearData() {
      this.game = false;
      this.enemy = false;
      this.ladder = 'play';
      this.timer = 0;
      this.str_timer = null;
      this.id = null;
    },
    cancel(e) {
      clearInterval(this.id);
      this.clearData();
      e.stopPropagation();
    },
    waiting() {
      this.timer = 10;
      this.str_timer = null;
      this.ladder = 'accept';
      this.id = setInterval(
        function () {
          if (this.authorized && this.timer > 0.1) {
            this.timer -= 0.1;
            if (this.timer < 3) {
              this.str_timer = this.timer.toFixed(1);
            } else if (this.timer < 7) {
              this.str_timer = this.timer.toFixed(0);
            }
          } else {
            clearInterval(this.id);
            this.clearData();
          }
        }.bind(this),
        100,
      );
    },
    findGame() {
      if (!this.enemy && !this.game) {
        this.game = true;
        this.ladder = 'search ...';
        this.id = setInterval(
          function () {
            if (this.authorized) {
              this.timer += 0.1;
              this.str_timer = this.timer.toFixed(1);
              if (this.timer >= 3) {
                this.enemy = true;
                clearInterval(this.id);
                this.waiting();
              }
            } else {
              clearInterval(this.id);
              this.clearData();
            }
          }.bind(this),
          100,
        );
      }
    },
  },
});
