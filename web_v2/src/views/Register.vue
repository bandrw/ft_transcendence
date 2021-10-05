<template>
	<div v-if="!user.isAuthorized()" class="container">
		<h1>Registration</h1>

		<form
			v-on:submit.prevent="register()"
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
			<input
				name="pass-confirm"
				type="password"
				placeholder="Confirm password"
				v-model="inputPasswordConfirmation"
			/>

			<span class="errors">
				{{ errors }}
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
					Register
				</span>
			</button>
		</form>

		<span class="separator">Or</span>

		<router-link class="register-link" to="/login">
			Sign in
		</router-link>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import CircleLoading from "@/components/CircleLoading.vue";
import User from "@/User";
import router from "@/router";
import axios from "axios";
import * as bcryptjs from 'bcryptjs';
import {userCreate, userLogin} from "@/apiTypes/apiTypes";

export default Vue.extend({
	name: "Register",
	components: {CircleLoading},
	props: {
		user: {
			type: User,
			required: true
		}
	},
	methods: {
		async register() {
			// validation
			if (!this.validate())
				return

			this.isLoading = true
			let r = await axios.get(`${process.env.VUE_APP_API_URL}/users/checkExist`, {
				params: { login: this.inputLogin }
			})
				.then(res => res.data)
			if (r) {
				this.errors = 'User with the same login already exists'
				this.isLoading = false
				return
			}
			await bcryptjs.hash(this.inputPassword, 10).then(res => { this.hashedPass = res })
			const createRes: userCreate = await axios.post(`${process.env.VUE_APP_API_URL}/users/create`, {
				login: this.inputLogin,
				pass: this.hashedPass
			})
				.then(res => res.data)
				.catch(err => this.errors = err)
			if (createRes.ok) {
				// Successful registration, getting user
				const loginResponse: userLogin = await axios.get(`${process.env.VUE_APP_API_URL}/users/login`, {
					params: { login: this.inputLogin }
				})
					.then(res => {
						return res.data
					})
					.catch(err => this.errors = err)
				// await axios.get(`${process.env.VUE_APP_API_URL}/users/login`, {
				// 	params: { login: this.inputLogin }
				// })
				if (loginResponse.id === undefined) {
					this.errors = 'Log in error'
					this.isLoading = false
					return
				}
				if (bcryptjs.compareSync(this.inputPassword, loginResponse.password)) {
					this.user.username = loginResponse.login
					this.user.loginDate = Date.now()

					this.$emit('update:user', this.user)
					this.errors = ''
					await router.push('/')
				} else {
					this.inputPassword = ''
					this.errors = 'Wrong login or password!'
				}
			} else {
				this.errors = createRes.msg
			}
			this.isLoading = false
		},
		validate() {
			if (!this.inputLogin) {
				this.errors = 'Enter login'
				return false
			}
			if (!this.inputPassword) {
				this.errors = 'Enter password'
				return false
			}
			if (this.inputLogin.length < 4) {
				this.errors = 'Login is too short'
				return false
			}
			if (this.inputLogin.length > 16) {
				this.errors = 'Login is too long'
				return false
			}
			if (this.inputPassword.length < 6) {
				this.errors = 'Password is too short'
				return false
			}
			if (this.inputPassword !== this.inputPasswordConfirmation) {
				this.errors = 'Passwords are not equal'
				return false
			}
			this.errors = ''
			return true
		}
	},
	data() {
		return {
			inputLogin: '',
			inputPassword: '',
			inputPasswordConfirmation: '',
			errors: '',
			isLoading: false,
			hashedPass: ''
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

	.errors {
		margin-bottom: 15px;
		color: red;
	}

	.register-link {
		color: #42b983;
		font-size: 1.2em;
		width: fit-content;
		padding: 0;

		&:hover {
			text-decoration: underline;
		}
	}

	.separator {
		margin: 30px 0;
	}
}

</style>