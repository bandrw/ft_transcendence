<template>
  <div id="app">
    <div v-if="!$store.state.authorized" id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
body {
  background-color: #79e7af;
}
</style>
