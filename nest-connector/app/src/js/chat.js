// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
// eslint-disable-next-line @typescript-eslint/no-var-requires
let bootstrap = require('bootstrap-vue');
Vue.use(bootstrap);

Vue.component('chat', {
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
    gameR: {
      type: Boolean,
      required: true,
    },
  },
  template: `<div class="Jquery_bundle">
               <div :class="classGame"
               v-on:click="showChat">
                  <div class="chat_performance" 
                    v-show="authorized">
                    <b-tabs content-class="mt-3">
                      <div v-for="chat in chats">
                        <b-tab :title="chat.name"  v-show="show_chat && chat.messages" id="chat_messages">
                          <div v-for="message in chat.messages">
                            <span>{{ message }}</span>
                          </div>
                          <input @click="messaging" id="chat_input" v-model="message">
                        </b-tab>
                      </div>
                    </b-tabs> 
                  </div>
                <div v-show="show_chat && users"
                        class="chat_users_side">
                    <div class="user_in_chat"
                         v-for="user in users"
                        v-on:mouseover="userInfo(user, $event)"
                        v-if="user && user.login!==im.login">
                        {{ user.login }}<span id="chat_user_status"
                        :style="{ backgroundColor: user.status }"></span></div>
                </div>
<!--                <div v-show="show_chat && messages" id="chat_messages">
                  <div v-for="Nmessage in messages">
                      <span>{{ Nmessage }}</span>
                  </div>
                  <input @click="messaging" id="chat_input" v-model="message">
                </div>-->
          </div>
          <div v-if="info" class="chat_user_info"
          :style="{ left: infoStyle.left, top: infoStyle.top }">
            {{ user.login }} <span :style="{color: pinColor(user.winP)}"><p>{{ winPercent(user.wins, user.games, user) }}%</p></span>
            <img :src="user.url_avatar" alt=""
            class="user_profile_avatar">
            <div id="user_personal_message" @click="personalChatOpen(user.login)">message</div>
            <div class="chat_user_profile_close_button" v-on:click="info=false">x</div>
          </div></div>
  `,
  data() {
    return {
      type: 'Chat',
      show_chat: false,
      info: false,
      user: null,
      infoStyle: {
        left: null,
        top: null,
      },
      chats: [{ name: false, id: false, messages: [] }],
      message: '',
    };
  },
  computed: {
    classGame: function () {
      if (this.authorized) {
        return {
          chat_opened: this.show_chat,
          chat_closed: !this.show_chat,
        };
      } else {
        this.show_chat = false;
        this.info = false;
      }
    },
  },
  methods: {
    personalChatOpen(login) {
      this.info = false;
      $('#chat_input').focus();
      let i = 0;
      while (i < this.chats.length) {
        if (this.chats[i].name === login) {
          break;
        }
        ++i;
      }
      if (i === this.chats.length) {
        this.chats.push({ name: login, messages: [] });
        axios.get(`/chat/create?from=${this.im.login}&to${login}`);
      }
    },
    messaging() {
      event.stopPropagation();
    },
    pinColor(winP) {
      if (!winP) {
        return 'white';
      } else if (winP < 45) {
        return 'red';
      } else if (winP < 50) {
        return 'yellow';
      } else if (winP < 55) {
        return 'green';
      } else if (winP < 60) {
        return 'blue';
      } else if (winP < 65) {
        return 'blueviolet';
      }
    },
    winPercent(wins, games, user) {
      user.winP = (wins / games).toFixed(2) * 100;
      return user.winP ? user.winP : 0;
    },
    userInfo(user, e) {
      this.info = true;
      this.user = user;
      this.infoStyle.left = e.pageX.toString() + 'px';
      this.infoStyle.top = e.pageY.toString() + 'px';
    },
    showChat() {
      if (this.show_chat) {
        this.show_chat = false;
        this.info = false;
      } else {
        this.show_chat = true;
      }
    },
  },
});
