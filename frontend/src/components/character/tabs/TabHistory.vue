<template>
  <div>
    <!-- Sem história cadastrada -->
    <div
      v-if="!character.history"
      class="text-center py-8"
      style="color: var(--text-faint);"
    >
      <p class="mb-1">Nenhuma história cadastrada.</p>
      <RouterLink
        :to="`/characters/${character.id}/edit`"
        class="text-xs"
        style="color: #f59e0b;"
        @click="$emit('goToHistoryTab')"
      >
        Adicionar história →
      </RouterLink>
    </div>

    <!-- História renderizada em Markdown -->
    <div
      v-else
      class="prose-custom break-words max-h-140 overflow-y-auto"
      v-html="renderedHistory"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import type { Character } from '@/types/character.types'

const props = defineProps<{ character: Character }>()

const renderedHistory = computed(() => {
  if (!props.character.history) return ''
  // marked.parse converte Markdown em HTML
  return marked.parse(props.character.history) as string
})
</script>

<style scoped>
/* Estilos do Markdown renderizado */
.prose-custom :deep(h1) {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.2rem 0 0.5rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--border);
}
.prose-custom :deep(h2) {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1rem 0 0.4rem;
}
.prose-custom :deep(h3) {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0.8rem 0 0.3rem;
}
.prose-custom :deep(p) {
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}
.prose-custom :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}
.prose-custom :deep(em) {
  color: var(--text-muted);
  font-style: italic;
}
.prose-custom :deep(ul),
.prose-custom :deep(ol) {
  color: var(--text-muted);
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}
.prose-custom :deep(li) {
  margin-bottom: 0.25rem;
  line-height: 1.6;
}
.prose-custom :deep(blockquote) {
  border-left: 3px solid #f59e0b;
  padding-left: 1rem;
  margin: 0.75rem 0;
  color: var(--text-faint);
  font-style: italic;
}
.prose-custom :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1rem 0;
}
</style>