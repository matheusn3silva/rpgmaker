import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('@/views/auth/VerifyEmailView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { requiresAuth: false }
    },

    // ── Protected routes (logged-in user only) ─────────────
    {
      path: '/characters',
      name: 'characters',
      component: () => import('@/views/characters/CharacterListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/characters/:id',
      name: 'character-details',
      component: () => import('@/views/characters/CharacterDetailsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/characters/:id/edit',
      name: 'character-edit',
      component: () => import('@/views/characters/CharacterEditView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/characters/new',
      name: 'character-new',
      component: () => import('@/views/characters/CharacterEditView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/settings/AccountSettingsView.vue'),
      meta: { requiresAuth: true }
    },

    // ── Redirects ─────────────────────────────────
    {
      path: '/',
      redirect: '/characters'
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ],
})

// ── Navigation Guard global ───────────────────────────────
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  // If route requires auth, check if user is authenticated
  const authStore = useAuthStore()

  // Only call fetchMe if we don't already have the user.
  if (!authStore.user) {
    await authStore.fetchMe()
  }

  if (!authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  return true
})

export default router