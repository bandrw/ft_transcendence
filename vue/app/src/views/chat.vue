<template>
  <div>
    <div :class="classGame" v-on:click="showChat">
      <div class="chat_performance">
        {{ type }}
      </div>
      <div v-show="show_chat && usersExceptByName" class="chat_users_side">
        <div
          class="user_in_chat"
          v-for="user in usersExceptByName"
          :key="user.login"
          v-on:mouseover="userInfo(user, $event)"
        >
          {{ user.login
          }}<span
            id="chat_user_status"
            :style="{ backgroundColor: user.status }"
          ></span>
        </div>
      </div>
      <div id="chat_messages">
        <div v-for="message in messages" :key="message">
          <span>{{ message }}</span>
        </div>
        <input @click.prevent="" id="chat_input" v-model="message">
      </div>
    </div>
    <div
      v-if="info"
      class="chat_user_info"
      :style="{ left: infoStyle.left, top: infoStyle.top }"
    >
      {{ user.login }}
      <span :style="{ color: pinColor(user.winP) }"
        ><p>{{ winPercent(user.wins, user.games, user) }}%</p></span
      >
      <img :src="user.url_avatar" class="user_profile_avatar" alt="" />
      <div class="chat_user_profile_close_button" v-on:click="SET_INFO(false)">
        x
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      message: "",
    };
  },
  computed: {
    ...mapState("chat", ["show_chat", "messages", "infoStyle", "type", "info"]),
    ...mapGetters(["usersExceptByName"]),
    classGame: function () {
      return {
        chat_opened: this.show_chat,
        chat_closed: !this.show_chat,
      };
    },
  },
  methods: {
    ...mapMutations("chat", [
      "SET_INFO",
      "SET_SHOW_CHAT",
      "SET_INFO_LEFT",
      "SET_INFO_TOP",
      "SET_USER_IN_CHAT",
    ]),
    showChat() {
      if (this.show_chat) {
        this.SET_SHOW_CHAT(false);
        this.SET_INFO(false);
      } else {
        this.SET_SHOW_CHAT(true);
      }
    },
    userInfo(user, e) {
      this.SET_INFO(true);
      this.SET_USER_IN_CHAT(user);
      this.SET_INFO_LEFT(e.pageX.toString() + "px");
      this.SET_INFO_TOP(e.pageY.toString() + "px");
    },
    pinColor(winP) {
      if (!winP) {
        return "white";
      } else if (winP < 45) {
        return "red";
      } else if (winP < 50) {
        return "yellow";
      } else if (winP < 55) {
        return "green";
      } else if (winP < 60) {
        return "blue";
      } else if (winP < 65) {
        return "blueviolet";
      }
    },
    winPercent(wins, games, user) {
      user.winP = (wins / games).toFixed(2) * 100;
      return user.winP ? user.winP : 0;
    },
  },
};
</script>

<style scoped>
.chat_closed {
  width: 35%;
  height: 8%;
  background-color: burlywood;
  position: absolute;
  left: 0;
  bottom: 0;
}

.chat_opened {
  width: 35%;
  height: 40%;
  background-color: blue;
  position: absolute;
  left: 0;
  bottom: 0;
}

.chat_users_side {
  width: 33%;
  height: 85%;
  background-color: aliceblue;
  left: 1%;
  position: absolute;
  bottom: 2%;
}

.user_in_chat {
  background-color: coral;
  width: 100%;
  height: 10%;
}

.chat_performance {
  top: 2%;
  height: 9%;
  position: absolute;
}

.chat_user_info {
  width: 15%;
  height: 15%;
  position: absolute;
  background-color: chocolate;
  text-align: center;
}

#chat_messages {
  width: 64%;
  right: 1%;
  height: 85%;
  bottom: 2%;
  position: absolute;
  background-color: #cacaca;
}

#chat_input {
  width: 96%;
  right: 1%;
  height: 10%;
  bottom: 2%;
  position: absolute;
  background-color: gold;
}

.chat_user_profile_close_button {
  position: absolute;
  top: 1%;
  right: 1%;
  width: 5%;
  height: 17%;
  text-align: center;
  background-color: aqua;
}

#chat_user_status {
  width: 10%;
  height: 10%;
  border-radius: 50%;
  right: 1%;
  position: absolute;
}

#user_personal_message {
  position: absolute;
  left: 3%;
  bottom: 3%;
  width: 35%;
  height: 15%;
  background-color: blueviolet;
}
</style>