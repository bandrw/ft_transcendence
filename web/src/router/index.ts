import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Main from '../views/Main.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Main',
		component: Main,
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/Login.vue')
	},
	{
		path: '/chat',
		name: 'Chat',
		component: () => import('../views/Chat.vue')
	},
	{
		path: '/:pathMatch(.*)*',
		name: '404',
		component: () => import('../views/Error.vue')
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
