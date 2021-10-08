<template>
  <div>
    <div id="user_unauthorized">
      <div v-if="!$store.state.authorized">
        <router-link to="/" class="tab">Login</router-link> |
        <router-link to="/about" class="tab">Register</router-link>
      </div>
      <router-view />
    </div>
  </div>
</template>

<style>
body {
  background-color: #79e7af;
}

#user_unauthorized {
  width: 50%;
  height: 27%;
  min-width: 500px;
  min-height: 250px;
  max-width: 600px;
  max-height: 300px;
  position: absolute;
  left: 15%;
  top: 15%;
}

.tab {
  text-align: left;
  width: 20%;
  background-color: beige;
  font-size: larger;
  margin: 1%;
  top: 5%;
}

p {
  font-family: Serif, fantasy, sans-serif;
}

input {
  font-family: Arial sans-serif;
  font-size: medium;
}
</style>
