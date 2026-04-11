<template>
  <AuthLayout>
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-8">
      <h2 class="text-xl font-semibold text-slate-100 mb-6">Faça seu login!</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- E-mail Field -->
        <div>
          <label class="block text-sm text-slate-400 mb-1" for="email">E-mail:</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            required
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                    text-slate-100 placeholder-slate-500 text-sm
                    focus:outline-none focus:border-amber-500 transition-colors"
          >
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-sm text-slate-400 mb-1" for="password">Senha:</label>
          <input 
            id="password"
            v-model="form.password"
            type="password" 
            placeholder="••••••••"
            required
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                   text-slate-100 placeholder-slate-500 text-sm
                   focus:outline-none focus:border-amber-500 transition-colors"
          >
        </div>

        <!-- Error message backend -->
        <p v-if="errorMessage" class="text-red-400 text-sm">
          {{ errorMessage }}
        </p>

        <!-- Unverified email notification -->
        <div
          v-if="showVerificationWarning"
          class="bg-amber-950 border border-amber-800 rounded-lg p-3 text-sm text-amber-300"
        >
          Email não verificado.
          <button
            type="button"
            @click="resendVerification"
            class="underline hover:text-amber-100 ml-1"
          >
            Reenviar confirmação
          </button>
        </div>
        
        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50
                 disabled:cursor-not-allowed text-white font-medium rounded-lg
                 py-2.5 text-sm transition-colors"
        >
          {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <div class="mt-4">
        <div class="relative flex items-center gap-3 mb-4">
          <div class="flex-1 h-px bg-slate-700" />
          <span class="text-xs text-slate-500">ou</span>
          <div class="flex-1 h-px bg-slate-700" />
        </div>

        <button
          type="button"
          @click="loginWithGoogle"
          class="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg
           border border-slate-600 text-slate-400 text-sm hover:border-slate-400
           hover:text-slate-100 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continuar com Google
        </button>
      </div>

      <div class="mt-6 space-y-2 text-center text-sm text-slate-400">
        <RouterLink to="/forgot-password" class="block hover:text-slate-300 transition-colors">
          Esqueceu a senha?
        </RouterLink>
        <RouterLink to="/register" class="block hover:text-slate-300 transition-colors">
          Não tem conta? <span class="text-amber-400">Cadastre-se</span>
        </RouterLink>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth.store'
import { authApi } from '@/api/auth.api'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const router = useRouter()
const route = useRoute() // accesses the current route (to get query parameters)
const authStore = useAuthStore()

// Form Local State
const form = ref({
  email: '',
  password: ''
}) 

const errorMessage = ref('')
const showVerificationWarning = ref(false)

async function handleSubmit() {
  errorMessage.value = ''
  showVerificationWarning.value = false

  try {
    await authStore.login(form.value)

    const redirect = route.query.redirect as string | undefined
    router.push(redirect || '/characters')
  } catch (err) {
    const message = (err as Error).message

    if (message === 'Email não verificado.') {
      showVerificationWarning.value = true
      toast.info('Seu email ainda não foi verificado. Por favor, verifique sua caixa de entrada.')
    } else {
      toast.error(message)
    }
  }
}

async function resendVerification() {
  try {
    await authApi.resendVerificationEmail(form.value.email)
    toast.success('E-mail de verificação reenviado! Verifique sua caixa de entrada.')
  } catch {
    toast.error('Erro ao reenviar e-mail de verificação.')
  }
}

function loginWithGoogle() {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
}
</script>