<template>
  <div id="app">
    <div v-if="!$store.state.authorized" id="user_unauthorized">
      <router-link to="/">Login</router-link> |
      <router-link to="/about">Register</router-link>
    </div>
    <router-view />
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
</style>
