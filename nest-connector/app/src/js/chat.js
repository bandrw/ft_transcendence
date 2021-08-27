// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
Vue.component('chat', {
  props: {
    authorized: {
      type: Boolean,
      required: true,
    },
  },
  template: `<div v-if="authorized"
             :class="{ chat_closed: !show_chat, chat_opened: show_chat }"
             v-on:click="showChat">
                <div class="chat_performance">
                    {{ type }}
                </div>
              <div v-if="show_chat"
                      class="chat_users_side">
                  <div class="user_in_chat"
                       v-for="user in users">
                      <p>{{ user.name }} {{ user.online }}</p>
                  </div>
              </div>
        </div>
  `,
  data() {
    return {
      type: 'Chat',
      show_chat: false,
      users: [
        {
          name: 'Mark',
          id: 1,
          game_status: false,
          online: true,
        },
        {
          name: 'Ivan',
          id: 2,
          game_status: false,
          online: false,
        },
      ],
    };
  },
  methods: {
    showChat() {
      if (this.show_chat) {
        this.show_chat = false;
      } else {
        this.show_chat = true;
      }
    },
    // getUsers() {
    //   try {
    //     const response = axios.get('/users/get');
    //     this.get_users = 'users';
    //     console.log(response);
    //     return response;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
  },
  components: {
    chat: 'chat',
  },
});
