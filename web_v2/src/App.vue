<template>
	<div id="app">
		<router-view
			:user="this.user"
			v-on:update="this.user = $event"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import User from "@/User.ts";

export default Vue.extend({
	data() {
		const user = new User();
		// // DEBUG
		// user.username = 'kfriese'
		// user.loginDate = Date.now()

		return {
			user: user
		}
	}
})
</script>

<style>
* {
	padding: 0;
	margin: 0;
	text-decoration: none;
}

#app {
	font-size: 16px;
	padding-top: 51px;
	position: relative;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	/*margin-top: 60px;*/
}
</style>
