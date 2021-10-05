<template>
	<div v-if="!user.isAuthorized()" class="container">
	<h1>Login page</h1>

	<form
		v-on:submit.prevent="authorize(inputLogin, inputPassword)"
	>
		<input
			name="log"
			type="text"
			placeholder="Login"
			v-model="inputLogin"
		/>
		<input
			name="pass"
			type="password"
			placeholder="Password"
			v-model="inputPassword"
		/>

		<span class="login-errors">
				{{ loginErrors }}
			</span>

		<button
			type="submit"
			class="login-btn"
		>
			<CircleLoading
				v-if="isLoading"
				bg-color="white"
				height="35px"
				width="35px"
			/>
			<span v-else>
					Log in
				</span>
		</button>
	</form>

	<router-link class="register-link" to="/register">
		Register
	</router-link>

	<span class="separator">Or</span>

	<div class="login-services">
		<button class="login-service" onclick="alert('not working yet')">
			Sign in with
			<span class="login-service-icon"/>
		</button>
	</div>
</div>
</template>

<script lang="ts">
import router from "@/router";
import Vue from "vue";
import CircleLoading from "@/components/CircleLoading.vue";
import User from "@/User.ts";
import axios from "axios";
import {userLogin} from "@/apiTypes/apiTypes";
import * as bcryptjs from 'bcryptjs';

export default Vue.extend({
	name: "Login",
	components: {CircleLoading},
	props: {
		user: {
			type: User,
			required: true
		}
	},
	methods: {
		async authorize(login: string, password: string): Promise<void> {
			// validation
			if (!login) {
				this.loginErrors = 'Enter login'
				return
			}
			if (!password) {
				this.loginErrors = 'Enter password'
				return
			}

			this.isLoading = true
			const loginResponse: userLogin = await axios.post(`${process.env.VUE_APP_API_URL}/users/login`, {
				login: login
			})
				.then(res => {
					return res.data
				})
				.catch(err => this.loginErrors = err)
			// await axios.get(`${process.env.VUE_APP_API_URL}/users/login`, {
			// 	params: { login: login }
			// })
			if (loginResponse.id === undefined) {
				this.loginErrors = 'Wrong login or password!'
				this.isLoading = false
				return
			}
			if (bcryptjs.compareSync(password, loginResponse.password)) {
				this.user.username = login
				this.user.loginDate = Date.now()

				this.$emit('update:user', this.user)
				this.loginErrors = ''
				await router.push('/')
			} else {
				this.inputPassword = ''
				this.loginErrors = 'Wrong login or password!'
			}

			this.isLoading = false
		}
	},
	data() {
		return {
			inputLogin: '',
			inputPassword: '',
			loginErrors: '',
			isLoading: false
		}
	},
	beforeMount(): void {
		if (this.user.isAuthorized())
			router.push('/')
	}
})
</script>

<style scoped lang="scss">

.container {
	margin: 0 auto;
	width: 1024px;
	height: calc(100vh - 101px);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	h1 {
		margin-bottom: 30px;
	}

	form {
		display: flex;
		flex-direction: column;
	}

	input {
		border-radius: 15px;
		width: calc(400px - 40px);
		border: 1px solid #2c3e50;
		outline: none;
		font-size: 1em;
		padding: 12px 20px;
		margin-bottom: 15px;
		transition: all 0.1s ease-in;

		&:focus {
			border-color: #42b983;
		}
	}

	button {
		border-radius: 15px;
		cursor: pointer;
		width: 400px;
		height: 50px;
		font-size: 1.2em;
		font-weight: bold;
		padding: 10px 12px;
		background: #42b983;
		border: none;
		outline: none;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.1s ease-in;

		@media (hover: hover) {
			&:hover {
				background: #42ad7b;
			}
		}
	}

	.login-errors {
		margin-bottom: 15px;
		color: red;
	}

	.register-link {
		color: #42b983;
		font-size: 1.2em;
		width: fit-content;
		padding: 0;
		margin-top: 20px;

		&:hover {
			text-decoration: underline;
		}
	}

	.separator {
		margin-top: 30px;
	}

	.login-services {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 30px;

		.login-service {
			margin-bottom: 20px;

			.login-service-icon {
				width: 30px;
				height: 30px;
				background-position: center;
				background-size: 100%;
				background-repeat: no-repeat;
				background-image: url("../assets/42-logo.png");
				margin-left: 10px;
			}

			&:last-child {
				margin-bottom: 0;
			}
		}
	}
}

</style>
