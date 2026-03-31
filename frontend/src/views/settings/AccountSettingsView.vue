<template>
  <AppLayout>
    <div class="max-w-lg mx-auto">
      <h1 class="text-2xl font-bold text-gray-100 mb-6">Configurações</h1>

      <!-- Tabs -->
      <div class="flex border-b border-gray-800 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
          :class="activeTab === tab.id
            ? 'text-amber-400 border-amber-400'
            : 'text-gray-500 border-transparent hover:text-gray-300'"
        >
          {{  tab.label }}
        </button>
      </div>

      <!-- Tab: Account -->
      <div v-if="activeTab === 'account'" class="space-y-6">

        <!-- Alter name -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 class="text-gray-100 font-medium mb-4">Alterar Nome</h2>

          <form @submit.prevent="handleUpdateName" class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Nome atual</label>
              <p class="text-gray-500 text-sm">{{ authStore.user?.name }}</p>
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-1" for="name">Novo nome</label>
              <input 
                id="name"
                v-model="nameForm.name"
                type="text"
                required
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                       text-gray-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <p v-if="nameSuccess" class="text-green-400 text-sm">Nome atualizado!</p>
            <p v-if="nameError" class="text-red-400 text-sm">{{ nameError }}</p>

            <button
              type="submit"
              :disabled="nameLoading"
              class="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white
                     text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {{ nameLoading ? 'Salvando...' : 'Salvar nome' }}
            </button>
          </form>
        </div>

        <!-- Alter password -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 class="text-gray-100 font-medium mb-4">Alterar senha</h2>

          <form @submit.prevent="handleUpdatePassword" class="space-y-4">
            <div>
              <label for="current-password" class="block text-sm text-gray-400 mb-1">
                Senha atual
              </label>
              <input 
                id="current-password"
                v-model="passwordForm.current"
                type="password"
                required
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                       text-gray-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-1" for="new-password">
                Nova senha
              </label>
              <input
                id="new-password"
                v-model="passwordForm.new"
                type="password"
                required
                minlength="6"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                       text-gray-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <p v-if="passwordSuccess" class="text-green-400 text-sm">Senha alterada!</p>
            <p v-if="passwordError" class="text-red-400 text-sm">{{ passwordError }}</p>

            <button
              type="submit"
              :disabled="passwordLoading"
              class="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white
                     text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {{ passwordLoading ? 'Salvando...' : 'Alterar senha' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Tab: Theme -->
      <div v-else-if="activeTab === 'theme'">
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 class="text-gray-100 font-medium mb-4">Tema</h2>

          <div class="grid grid-cols-2 gap-3">

            <button
              @click="themeStore.setTheme('dark')"
              class="p-4 rounded-xl border-2 transition-colors text-left"
              :class="themeStore.theme === 'dark'
                ? 'border-amber-500 bg-gray-800'
                : 'border-gray-800 hover:border-gray-600'"
            >
              <div class="w-full h-16 bg-gray-950 rounded-lg mb-3 border border-gray-800" />
              <p class="text-sm font-medium text-gray-200">Escuro</p>
              <p class="text-xs text-gray-600">Tema padrão</p>
            </button>

            <button
              @click="themeStore.setTheme('light')"
              class="p-4 rounded-xl border-2 transition-colors text-left"
              :class="themeStore.theme === 'light'
                ? 'border-amber-500 bg-gray-800'
                : 'border-gray-800 hover:border-gray-600'"
            >
              <div class="w-full h-16 bg-gray-100 rounded-lg mb-3 border border-gray-200" />
              <p class="text-sm font-medium text-gray-200">Claro</p>
              <p class="text-xs text-gray-600">Em desenvolvimento</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue';
import { useAuthStore } from '@/stores/auth.store'
import { useThemeStore } from '@/stores/theme.store'
import { userApi } from '@/api/user.api'

const authStore = useAuthStore()
const themeStore = useThemeStore()

type TabId = 'account' | 'theme'
const activeTab = ref<TabId>('account')
const tabs: { id: TabId, label: string }[] = [
  { id: 'account', label: 'Conta' },
  { id: 'theme', label: 'Tema' },
]

const nameForm = ref({ name: '' })
const nameLoading = ref(false)
const nameSuccess = ref(false)
const nameError = ref('')

// State name form
async function handleUpdateName() {
  nameLoading.value = true
  nameSuccess.value = false
  nameError.value = ''

  try {
    await userApi.updateName(nameForm.value.name)
    await authStore.fetchMe()
    nameSuccess.value = true
    nameForm.value.name = ''
  } catch (err) {
    nameError.value = (err as Error).message
  } finally {
    nameLoading.value = false
  }
}

// State password form
const passwordForm = ref({ current: '', new: '' })
const passwordLoading = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref('')

async function handleUpdatePassword() {
  passwordLoading.value = true
  passwordSuccess.value = false
  passwordError.value = ''

  try {
    await userApi.updatePassword(passwordForm.value.current, passwordForm.value.new)
    passwordSuccess.value = true
    passwordForm.value = { current: '', new: '' }
  } catch (err) {
    passwordError.value = (err as Error).message
  } finally {
    passwordLoading.value = false
  }
}
</script>
