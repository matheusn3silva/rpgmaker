<template>
  <AuthLayout>
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
      <div v-if="loading" class="text-slate-400 text-sm">Verificando...</div>

      <div v-else-if="success">
        <p class="text-green-400 font-medium mb-4">Email verificado com sucesso!</p>
        <RouterLink
          to="/login"
          class="text-sm text-amber-400 hover:text-amber-300 transition-colors"
        >
          Fazer login
        </RouterLink>
      </div>

      <div v-else>
        <p class="text-red-400 font-medium mb-4">Link inválido ou expirado.</p>
        <RouterLink
          to="/login"
          class="text-sm text-amber-400 hover:text-amber-300 transition-colors"
        >
          Voltar para o login
        </RouterLink>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { authApi } from '@/api/auth.api'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const route = useRoute()
const loading = ref(true)
const success = ref(false)

onMounted(async () => {
  const token = route.query.token as string | undefined
  if (!token) {
    loading.value = false
    return
  }
  try {
    await authApi.verifyEmail(token)
    success.value = true
    toast.success('Email verificado com sucesso!')
  } catch {
    success.value = false
    toast.error('Link inválido ou expirado.')
  } finally {
    loading.value = false
  }
})
</script>