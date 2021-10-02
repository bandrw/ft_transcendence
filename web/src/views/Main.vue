<template>
	<div v-if="user.isAuthorized()">
		<Header :user="this.user"/>
		<div class="main">

			<Game/>
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
	beforeMount(): void {
		if (!this.user.isAuthorized())
			router.push('/login')
	}
})

</script>

<style scoped lang="scss">

.main {
	font-size: 1em;
}

</style>
