<template>
  <span></span>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState(["eventSource", "users", "user", "enemy"]),
  },
  methods: {
    ...mapMutations([
      "ADD_USER",
      "CREATE_EVENT_SOURCE",
      "INCREMENT_USERS_WINS",
      "INCREMENT_USERS_GAMES",
      "INCREMENT_USER_WINS",
      "INCREMENT_USER_GAMES",
      "DEL_USER",
    ]),
    addUser(event) {
      const user = JSON.parse(event.data);
      let i = 0;
      while (i < this.users.length) {
        if (this.users[i].login === user.login) {
          break;
        }
        ++i;
      }
      if (i === this.users.length) {
        this.ADD_USER(user);
      }
    },
    updateUserStats(event) {
      const stats = JSON.parse(event.data);
      let i = 0;
      this.INCREMENT_USER_GAMES();
      if (this.user.login === stats.winner) {
        this.INCREMENT_USER_WINS();
      }
      while (i < this.users.length) {
        if (this.users[i].login === stats.winner) {
          this.INCREMENT_USERS_GAMES(i);
          this.INCREMENT_USERS_WINS(i);
        } else if (this.users[i].login === stats.looser) {
          this.INCREMENT_USERS_GAMES(i);
        }
        ++i;
      }
    },
    logoutSSE(event) {
      const user = JSON.parse(event.data);
      let index = 0;
      while (index < this.users.length) {
        if (this.users[index].login === user.login) {
          this.DEL_USER(index);
          return;
        }
        ++index;
      }
    },
    updateUser() {
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
    },
    listenEvents() {
      this.CREATE_EVENT_SOURCE(this.user.login);
      this.eventSource.addEventListener("login", this.addUser);
      this.eventSource.addEventListener(
        "updateUsersStats",
        this.updateUserStats
      );
      this.eventSource.addEventListener("logout_SSE", this.logoutSSE);
    },
  },
};
</script>
