<template>
	<div v-if="user.isAuthorized()">
		<Header :user="this.user"/>
		{{this.user}}
		<div class="main">

			<Game v-if="isGameShown"/>
			<button
				v-on:click="findGame"
				class="find-game-btn"
			>
				Find game
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import router from "@/router";
import Vue from 'vue';
import User from "@/User.ts";
import Game from "@/components/Game.vue";
import axios from "axios";

export default Vue.extend({
	name: 'Main',
	components: {
		Game,
		Header
	},
	props: {
		user: {
			type: User,
			required: true
		}
	},
	data() {
		return {
			isGameShown: false
		}
	},
	methods: {
		async findGame() {
			await axios.get(`${process.env.VUE_APP_API_URL}/ladder/gameStatus`, {
				params: {
					login: this.user.username,
					status: 'yellow'
				}
			}).catch(err => console.log('gameStatus error: ', err))
			setInterval(() => {
				console.log('waiting')
			}, 100)
		}
	},
	beforeMount(): void {
		if (!this.user.isAuthorized())
			router.push('/login')
	}
})

</script>

<style scoped lang="scss">

.main {
	font-size: 1em;

	.find-game-btn {
		margin-top: 50px;
		font-size: 1.2em;
		padding: 15px 25px;
		color: white;
		background: #42b983;
		border: none;
		outline: none;
		border-radius: 20px;
		cursor: pointer;
		font-weight: bold;
	}
}

</style>
