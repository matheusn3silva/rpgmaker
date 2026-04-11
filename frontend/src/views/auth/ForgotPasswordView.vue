<template>
  <AuthLayout>
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-8">
      <h2 class="text-xl font-semibold text-slate-100 mb-2">Recuperar senha</h2>
      <p class="text-slate-400 text-sm mb-6">
        Informe seu email e enviaremos as instruções.
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm text-slate-400 mb-1">Email:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                   text-slate-100 placeholder-slate-500 text-sm
                   focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div
          v-if="submitted"
          class="bg-amber-950 border border-amber-800 rounded-lg p-3 text-sm text-amber-300"
        >
          Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.
        </div>

        <button 
          type="submit"
          :disabled="loading || submitted"
          class="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50
                 disabled:cursor-not-allowed text-white font-medium rounded-lg
                 py-2.5 text-sm transition-colors"
        >
          {{ loading ? 'Enviando...' : 'Enviar instruções' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <RouterLink to="/login" class="text-sm text-slate-400 hover:text-slate-300 transition-colors">
          Voltar para o login
        </RouterLink>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { authApi } from '@/api/auth.api'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const email = ref('')
const loading = ref(false)
const submitted = ref(false)

async function handleSubmit() {
  loading.value = true
  
  try {
    await authApi.forgotPassword(email.value)
    toast.success('Instruções enviadas com sucesso!')
  } finally {
    loading.value = false
    submitted.value = true
  }
}
</script>