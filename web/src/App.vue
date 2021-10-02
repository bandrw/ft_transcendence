<template>
	<router-view v-model:user="this.user"/>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import User from "@/User.ts";

export default defineComponent ({
	data () {
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
