// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
user = require('./user');

new Vue({
  el: '#app',
  modules: {
    user: 'user',
  },
});
