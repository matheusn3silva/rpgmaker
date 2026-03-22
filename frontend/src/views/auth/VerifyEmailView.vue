<template>
  <AuthLayout>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
      <div v-if="loading" class="text-gray-400 text-sm">Verificando...</div>

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
  } catch {
    success.value = false
  } finally {
    loading.value = false
  }
})
</script>