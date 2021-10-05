<template>
	<div v-if="user.isAuthorized()">
		<Header :user="this.user"/>
		<div class="main">

			<Game v-if="isGameShown"/>
			<button
				v-on:click="findGame"
				class="find-game-btn"
			>Find game</button>
<!--			<game v-show="gameR" ref="game" @socketEmit="socketEmit"></game>-->
<!--			<div @login="addUser"></div>-->
<!--			<chat :authorized="authorized" :im="im" :users="users" ref="chat" :gameR="gameR"></chat>-->
<!--			<ladder-->
<!--					:authorized="authorized" -->
<!--					@kickEnemy="enemy = false"-->
<!--					:im="im" -->
<!--					:users="users" -->
<!--					:enemy="enemy"-->
<!--					ref="ladder"-->
<!--			>-->
<!--			</ladder>-->
<!--			<div class="Jquery_bundle" :class="{ user_authorized: authorized, user_unauthorized: !authorized }">-->
<!--				<div v-show="authorized">-->
<!--					<div class="user_logout_button" v-on:click="logout">logout</div>-->
<!--					<div class="user_profile_button" v-on:click="showProfile">{{ im.login }}</div>-->
<!--				</div>-->
<!--				<wall v-show="!authorized" @authSuccess="authSuccess" @logout="logout" :authorized="authorized"></wall>-->
<!--			</div>-->
<!--			<div v-show="profile && isAuthorized && !gameR" class="user_profile">-->
<!--				<img :src="im.url_avatar" class="user_profile_avatar" alt="user_profile_avatar">-->
<!--				<div id="user_update_avatar" v-on:click="updateAvatar"></div>-->
<!--				<div class="user_profile_close_button" v-on:click="showProfile">x</div>-->
<!--			</div>-->
		</div>
	</div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import router from "@/router";
import { defineComponent } from 'vue';
import User from "@/User.ts";
import Game from "@/components/Game.vue";
import axios from "axios";

export default defineComponent({
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
			})
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
