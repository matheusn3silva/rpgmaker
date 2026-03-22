<template>
  <AuthLayout>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-8">
      <h2 class="text-xl font-semibold text-gray-100 mb-6">Altere a sua senha!</h2>

      <div
        v-if="!token"
        class="bg-red-950 border border-red-800 rounded-lg p-3 text-sm text-red-300"
      >
        Link inválido. Solicite uma nova recuperação de senha.
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="password" class="block text-sm text-gray-400 mb-1">Nova Senha.</label>
          <input 
            id="password"
            v-model="password"
            type="password" 
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                   text-gray-100 placeholder-gray-600 text-sm
                   focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <p v-if="errorMessage" class="text-red-400 text-sm">{{ errorMessage }}</p>

        <div
          v-if="success"
          class="bg-green-950 border border-green-800 rounded-lg p-3 text-sm text-green-300"
        >
          Senha alterada com sucesso!
          <RouterLink to="/login" class="underline ml-1">Fazer login</RouterLink>
        </div>

        <button 
          type="submit"
          :disabled="loading || success"
          class="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50
                 disabled:cursor-not-allowed text-white font-medium rounded-lg
                 py-2.5 text-sm transition-colors"
        >
          {{ loading ? 'Salvando...' : 'Redefinir senha' }}
        </button>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { authApi } from '@/api/auth.api'

const route = useRoute()

const token = route.query.token as string | undefined

const password = ref('')
const loading = ref(false)
const success = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  if (!token) return
  loading.value = true
  errorMessage.value = ''

  try {
    await authApi.resetPassword(token, password.value)
    success.value = true
  } catch (err) {
    errorMessage.value = (err as Error).message
  } finally {
    loading.value = false
  }
}
</script>