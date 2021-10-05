<template>
	<header :user="this.user">
		<div class="container">
			<h1>
				ft_transcendence
			</h1>
			<div class="links">
				<router-link to="/">
					Home
				</router-link>
				<router-link to="/chat">
					Chat
				</router-link>
			</div>
			<div class="user">
				<div class="user-img"/>
				<div class="user-username">
					{{ user.username }}
				</div>
				<button class="user-btn"/>
			</div>
		</div>
	</header>
</template>

<script lang="ts">

import Vue from "vue";
import User from '@/User.ts'

export default Vue.extend({
	name: "Header",
	props: {
		user: {
			type: User,
			required: true
		}
	}
})
</script>

<style scoped lang="scss">

header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	height: 50px;
	justify-content: center;
	border-bottom: 1px solid green;

	.container {
		display: flex;
		align-items: center;
		width: 1024px;
		height: 100%;

		h1 {
			color: #42b983;
			display: flex;
			align-items: center;
			width: 30%;
		}

		.links {
			width: 50%;
			display: flex;

			a {
				margin: 0 10px;
				width: 80px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #2c3e50;
			}
		}

		.user {
			width: calc(20% - 20px);
			padding: 0 10px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border: 1px solid #2c3e50;
			border-radius: 5px;
			height: 80%;

			.user-img {
				width: 30px;
				height: 30px;
				border: 1px solid #ccc;
				border-radius: 50%;
			}

			.user-username {
				width: 60%;
				height: 35px;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.user-btn {
				width: 30px;
				height: 30px;
				background: #ccc;
				border: none;
				outline: none;
				cursor: pointer;
			}
		}
	}
}

</style>
