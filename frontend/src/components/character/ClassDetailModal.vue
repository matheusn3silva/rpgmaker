<template>
  <!-- Overlay: clique fora fecha o modal -->
  <div
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    style="background-color: rgba(0,0,0,0.6);"
    @click.self="$emit('close')"
  >
    <div
      class="w-full sm:max-w-lg sm:mx-4 rounded-t-2xl sm:rounded-xl overflow-hidden"
      style="background-color: var(--bg-surface); border: 1px solid var(--border);"
    >
      <!-- Header -->
      <div
        class="flex items-start justify-between px-6 py-4"
        style="border-bottom: 1px solid var(--border);"
      >
        <div class="flex-1 pr-4">
          <h2 class="text-lg font-semibold" style="color: var(--text-primary);">
            {{ rpgClass.name }}
          </h2>
          <p class="text-sm mt-0.5" style="color: var(--text-muted);">
            {{ rpgClass.description }}
          </p>
        </div>

        <button
          @click="$emit('close')"
          class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style="color: var(--text-faint);"
          :style="{ 'background-color': 'var(--bg-input)' }"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="flex justify-center pt-2 sm:hidden">
        <div class="w-10 h-1 rounded-full" style="background-color: var(--border);" />
      </div>

      <!-- Body: habilidades -->
      <div class="px-6 py-4 max-h-96 overflow-y-auto">

        <div v-if="loading" class="text-center py-8" style="color: var(--text-faint);">
          Carregando habilidades...
        </div>

        <div v-else-if="skills.length === 0" class="text-center py-8" style="color: var(--text-faint);">
          Nenhuma habilidade cadastrada para esta classe.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="skill in skills"
            :key="skill.id"
            class="rounded-lg p-4"
            style="background-color: var(--bg-input); border: 1px solid var(--border);"
          >
            <!-- Nome e tipo da habilidade -->
            <div class="flex items-start justify-between gap-3 mb-2">
              <span class="font-medium text-sm" style="color: var(--text-primary);">
                {{ skill.name }}
              </span>
              <span
                class="text-xs px-2 py-0.5 rounded shrink-0"
                :style="skillTypeStyle(skill.type)"
              >
                {{ skillTypeLabel(skill.type) }}
              </span>
            </div>

            <!-- Descrição -->
            <p class="text-xs mb-3" style="color: var(--text-muted);">
              {{ skill.description }}
            </p>

            <div class="flex gap-3">
              <span v-if="skill.psCost > 0" class="text-xs" style="color: var(--text-faint);">
                PS: <span class="text-amber-400 font-medium">{{ skill.psCost }}</span>
              </span>
              <span v-if="skill.peCost > 0" class="text-xs" style="color: var(--text-faint);">
                PE: <span class="text-amber-400 font-medium">{{ skill.peCost }}</span>
              </span>
              <span
                v-if="skill.psCost === 0 && skill.peCost === 0"
                class="text-xs"
                style="color: var(--text-faint);"
              >
                Sem custo
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { classesApi } from '@/api/classes.api';

interface Skill {
    id: number
    name: string
    type: string
    description: string
    psCost: number
    peCost: number
}

const props = defineProps<{
    rpgClass: { id: number, name: string, description: string }
}>()

defineEmits<{ close: [] }>()

const skills = ref<Skill[]>([])
const loading = ref(true)

onMounted(async () => {
    try {
        const { data } = await classesApi.getById(props.rpgClass.id)
        skills.value = data.skills ?? []
    } catch {
        skills.value = []
    } finally {
        loading.value = false
    }
})

function skillTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    PASSIVA:       'Passiva',
    ATIVA_ACAO:    'Ação',
    ATIVA_BONUS:   'Bônus',
    ATIVA_REACAO:  'Reação',
  }
  return labels[type] ?? type
}

function skillTypeStyle(type: string): string {
  const styles: Record<string, string> = {
    PASSIVA:      'background-color: #1e3a5f; color: #93c5fd;',
    ATIVA_ACAO:   'background-color: #3b1f0a; color: #fbbf24;',
    ATIVA_BONUS:  'background-color: #14532d; color: #86efac;',
    ATIVA_REACAO: 'background-color: #3b0a0a; color: #fca5a5;',
  }
  return styles[type] ?? 'background-color: var(--bg-input); color: var(--text-muted);'
}
</script>