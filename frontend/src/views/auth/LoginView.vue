<template>
  <AuthLayout>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-8">
      <h2 class="text-xl font-semibold text-gray-100 mb-6">Faça seu login!</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- E-mail Field -->
        <div>
          <label class="block text-sm text-gray-400 mb-1" for="email">E-mail:</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            required
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                    text-gray-100 placeholder-gray-600 text-sm
                    focus:outline-none focus:border-amber-500 transition-colors"
          >
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-sm text-gray-400 mb-1" for="password">Senha:</label>
          <input 
            id="password"
            v-model="form.password"
            type="password" 
            placeholder="••••••••"
            required
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                   text-gray-100 placeholder-gray-600 text-sm
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

      <div class="mt-6 space-y-2 text-center text-sm text-gray-500">
        <RouterLink to="/forgot-password" class="block hover:text-gray-300 transition-colors">
          Esqueceu a senha?
        </RouterLink>
        <RouterLink to="/register" class="block hover:text-gray-300 transition-colors">
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
    } else {
      errorMessage.value = message
    }
  }
}

async function resendVerification() {
  try {
    await authApi.resendVerificationEmail(form.value.email)
    errorMessage.value = 'E-mail de verificação reenviado! Verifique sua caixa de entrada.'
  } catch {
    errorMessage.value = 'Erro ao reenviar e-mail de verificação.'
  }
}
</script>