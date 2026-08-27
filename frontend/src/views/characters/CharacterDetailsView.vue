<template>
  <AppLayout>

    <!-- Loading -->
    <div v-if="store.loading" class="text-center py-12 text-slate-500">
      Carregando personagem...
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="text-center py-12 text-red-400">
      {{ store.error }}
    </div>

    <!-- Content -->
    <template v-else-if="store.currentCharacter">
      <!-- Character header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold capitalize" style="color: var(--text-primary);">
            {{ store.currentCharacter.name }}
          </h1>
          <p class="text-slate-400 mt-1">
            {{ store.currentCharacter.race }} ·
            {{ store.currentCharacter.class_name }} ·
            Nível {{ store.currentCharacter.level }}
          </p>
        </div>

        <RouterLink
          :to="`/characters/${store.currentCharacter.id}/edit`"
          class="text-sm border border-slate-600 text-slate-400 hover:text-slate-100
                 hover:border-slate-400 px-4 py-2 rounded-lg transition-colors"
        >
          Editar
        </RouterLink>
      </div>

      <!-- Tab navigation -->
      <NavTabs ref="navTabsRef" />

      <!-- Active tab content -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <TabGeneralData
          v-if="activeTab === 'general'"
          :character="store.currentCharacter"
        />
        <TabAttributes
          v-else-if="activeTab === 'attributes'"
          :character="store.currentCharacter"
        />
        <TabProficiencies
          v-else-if="activeTab === 'proficiencies'"
          :proficiencies="store.currentCharacter.proficiencies"
        />
        <TabSkills
          v-else-if="activeTab === 'skills'"
          :character-id="store.currentCharacter.id"
          :class-id="store.currentCharacter.classId"
          :character-skill="store.currentCharacter.skills?.[0] ?? null" 
        />
        <TabHistory
          v-else-if="activeTab === 'history'"
          :character="store.currentCharacter"
        />
      </div>

      <!-- Back page -->
      <div class="mt-4">
        <RouterLink
          to="/characters"
          class="text-sm text-slate-500 hover:text-slate-400 transition-colors"
        >
          ← Voltar para personagens
        </RouterLink>
      </div>
    </template>

  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useCharacterStore } from '@/stores/character.store'
import TabGeneralData from '@/components/character/tabs/TabGeneralData.vue'
import TabAttributes from '@/components/character/tabs/TabAttributes.vue'
import TabHistory from '@/components/character/tabs/TabHistory.vue'
import TabSkills from '@/components/character/tabs/TabSkills.vue'
import TabProficiencies from '@/components/character/tabs/TabProficiencies.vue'
import NavTabs from '@/components/character/NavTabs.vue'


const route = useRoute()
const store = useCharacterStore()

const navTabsRef = ref<InstanceType<typeof NavTabs> | null>(null)

const activeTab = computed(() => navTabsRef.value?.activeTab)

onMounted(() => {
  // let ID and convert in number
  const id = Number(route.params.id)
  if (!isNaN(id)) {
    store.fetchCharacterById(id)
  }

})
</script>