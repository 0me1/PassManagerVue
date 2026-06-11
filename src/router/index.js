import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '../components/StartPage.vue'
import PasswordManager from '../components/PasswordManager.vue'
import InfoPage from '../components/InfoPage.vue'

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
