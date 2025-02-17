import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  { path: '/', component: HomeView, name: 'home' },
  { path: '/about', component: AboutView, name: 'about' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
