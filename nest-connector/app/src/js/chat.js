// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');

Vue.component('chat', {
  props: {
    authorized: {
      type: Boolean,
      required: true,
    },
  },
  template: `<div :class="classGame"
             v-on:click="showChat">
                <div class="chat_performance" 
                  v-if="authorized">
                    {{ type }}
                </div>
              <div v-if="show_chat"
                      class="chat_users_side">
                  <div class="user_in_chat"
                       v-for="user in users">
                      <p>{{ user.login }} {{ user.id }}</p>
                  </div>
              </div>
        </div>
  `,
  data() {
    return {
      type: 'Chat',
      show_chat: false,
      users: null,
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
      }
    },
  },
  methods: {
    showChat() {
      if (this.show_chat) {
        this.show_chat = false;
      } else {
        this.show_chat = true;
      }
    },
  },
  async mounted() {
    this.users = await axios.get('/users/getAll').then(function (response) {
      return response.data;
    });
  },
});
