<template>
  <AppLayout>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-100">Meus Personagens</h1>
      <RouterLink 
        to="/characters/new"
        class="bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium
               px-4 py-2 rounded-lg transition-colors"
      >
        + Novo personagem
      </RouterLink>
    </div>

    <!-- State loading -->
    <div v-if="store.loading" class="text-center py-12 text-gray-600">
      Carregando personagens...
    </div>

    <!-- State error -->
    <div
      v-else-if="store.error"
      class="text-center py-12 text-red-400"
    >
      {{ store.error }}
    </div>

    <!-- State void list -->
    <div
      v-else-if="store.characters.length === 0"
      class="text-center py-12"
    >
      <p class="text-gray-600 mb-4">Nenhum personagem criado ainda.</p>
      <RouterLink 
        to="/characters/new"
        class="text-amber-400 hover:text-amber-300 text-sm transition-colors"
      >
        Criar meu primeiro personagem
      </RouterLink>
    </div>

    <!-- State data with list -->
     <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <CharacterCard 
            v-for="character in store.characters"
            :key="character.id"
            :character="character"
            @delete="handleDelete"
          />
        </div>

        <!-- Pagination -->
        <div
          v-if="store.pagination && store.pagination.totalPages > 1"
          class="flex items-center justify-center gap-2"
        >
          <button
            @click="changePage(store.pagination!.page - 1)"
            :disabled="store.pagination.page === 1"
            class="px-3 py-1.5 text-sm rounded-lg border border-gray-800 text-gray-400
                    hover:text-gray-100 hover:border-gray-600 disabled:opacity-30
                    disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>

          <span class="text-gray-500 text-sm">
            {{ store.pagination.page }} / {{ store.pagination.totalPages }}
          </span>

          <button
            @click="changePage(store.pagination!.page + 1)"
            :disabled="store.pagination.page === store.pagination.totalPages"
            class="px-3 py-1.5 text-sm rounded-lg border border-gray-800 text-gray-400
                    hover:text-gray-100 hover:border-gray-600 disabled:opacity-30
                    disabled:cursor-not-allowed transition-colors"
          >
            Próxima
          </button>
        </div>
     </template>

    <!-- Modal confirmation delete -->
    <div
      v-if="deleteTargetId !== null"
      class="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50"
      @click.self="deleteTargetId = null"
    >
      <div class="-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-sm">
        <h3 class="text-gray-100 font-semibold mb-2">Excluir personagem</h3>
        <p class="text-gray-500 text-sm mb-6">Tem certeza? Essa ação não pode ser desfeita.</p>
        <div class="flex gap-3">
          <button
            @click="deleteTargetId = null"
            class="flex-1 py-2 text-sm rounded-lg border border-gray-700
                   text-gray-400 hover:text-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmDelete"
            :disabled="deleting"
            class="flex-1 py-2 text-sm rounded-lg bg-red-800 hover:bg-red-700
                   text-white disabled:opacity-50 transition-colors"
          >
            {{ deleting ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CharacterCard from '@/components/character/CharacterCard.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { useCharacterStore } from '@/stores/character.store'

const store = useCharacterStore()

// ID Character deleting
// Closed Modal
const deleteTargetId = ref<number | null>(null)
const deleting = ref(false)

onMounted(() => {
  store.fetchCharacters(1)
})

// Open Modal
function handleDelete(id: number) {
  deleteTargetId.value = id
}

async function confirmDelete() {
  if (deleteTargetId.value === null) return
  deleting.value = true

  try {
    await store.deleteCharacter(deleteTargetId.value)
    deleteTargetId.value = null
  } finally {
    deleting.value = false
  }
}

function changePage(page: number) {
  store.fetchCharacters(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>