<template>
	<div>
		<Header :user="this.user"/>
		Chat view
	</div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import router from "@/router/index.ts";
import User from "@/User.ts";
import {defineComponent} from "vue";

export default defineComponent ({
	name: "Chat",
	components: {Header},
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

<style scoped>

</style>