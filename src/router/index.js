import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/profile/:userID',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      props: true,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/bands',
      name: 'bands',
      component: () => import('@/views/BandsView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  //if on /login and authenticated redirect to home
  if (to.path === '/login' && auth.currentUser) {
    next('/')
    return
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !auth.currentUser) {
    next('/login')
    return
  }

  next();
})

export default router
