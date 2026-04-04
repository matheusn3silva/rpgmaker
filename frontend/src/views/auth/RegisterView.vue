<template>
  <AuthLayout>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-8">
      <h2 class="text-xl font-semibold text-gray-100 mb-6">Crie sua conta!</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm text-gray-400 mb-1">Nome:</label>        
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Seu nome"
            required
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                   text-gray-100 placeholder-gray-600 text-sm
                   focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label for="email" class="block text-sm text-gray-400 mb-1">Email:</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Seu email"
            required
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                   text-gray-100 placeholder-gray-600 text-sm
                   focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label for="password" class="block text-sm text-gray-400 mb-1">Senha:</label>
          <input
            id="password"
            v-model="form.password"
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
          Conta criada com sucesso! Verifique seu email para confirmar o cadastro.
        </div>

        <button
          type="submit"
          :disabled="authStore.loading || success"
          class="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50
                 disabled:cursor-not-allowed text-white font-medium rounded-lg
                 py-2.5 text-sm transition-colors"
        >
          {{ authStore.loading ? 'Criando conta...' : 'Criar conta' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-500">
        <RouterLink to="/login" class="hover:text-gray-300 transition-colors">
          Já tem conta? <span class="text-amber-400">Entrar</span>
        </RouterLink>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const authStore = useAuthStore()

const form = ref({ name: '', email: '', password: '' })
const errorMessage = ref('')
const success = ref(false)

async function handleSubmit() {
  errorMessage.value = ''

  try {
    await authStore.register(form.value)
    success.value = true
    toast.success('Conta criada com sucesso! Verifique seu email para confirmar o cadastro.')
  } catch (err) {
    toast.error((err as Error).message)
  }
}
 
</script>
