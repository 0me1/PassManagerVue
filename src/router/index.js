import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '../pages/StartPage.vue'
import PasswordManager from '../pages/PasswordManager.vue'
import InfoPage from '../pages/InfoPage.vue'

const routes = [
  {
    path: '/',
    name: 'start',
    component: StartPage
  },
  {
    path: '/manager',
    name: 'manager',
    component: PasswordManager
  },
  {
    path: '/info',
    name: 'info',
    component: InfoPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
