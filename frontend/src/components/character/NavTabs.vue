<template>
    <div class="overflow-x-auto overflow-y-hidden flex border-b border-slate-700 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2.5 text-sm font-medium transition-colors border-2 rounded-t-lg -mb-px flex items-center gap-2 shrink-0 whitespace-nowrap"
          :class="activeTab === tab.id
            ? 'text-amber-400 border-amber-400'
            : 'text-slate-400 border-transparent hover:text-slate-300'"
        >
          {{ tab.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Active Tab — local state
type TabId = 'general' | 'attributes' | 'history' | 'skills' | 'proficiencies' 
const activeTab = ref<TabId>('general')

const tabs: { id: TabId; label: string }[] = [
  { id: 'general',    label: 'Dados Gerais' },
  { id: 'attributes', label: 'Atributos' },
  { id: 'proficiencies', label: 'Proficiências' },
  { id: 'skills',     label: 'Habilidades' },
  { id: 'history',    label: 'História' },
]

defineExpose({
    activeTab
})
</script>