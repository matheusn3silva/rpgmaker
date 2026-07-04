<template>
    <div class="space-y-6">

        <div v-if="groupedProficiencies.length === 0" class="text-center py-8" style="color: var(--text-faint);">
            Nenhuma proficiência registrada.
        </div>

        <!-- Grouped for category -->
        <div v-for="group in groupedProficiencies" :key="group.category">
            <h3 class="text-xs uppercase tracking-wider mb-3" style="color: var(--text-faint);">
                {{ categoryLabel(group.category) }}
            </h3>

            <div class="grid grid-cols-2 gap-2">
                <div
                    v-for="item in group.items"
                    :key="item.proficiencyId"
                    class="flex items-center justify-between px-3 py-2 rounded-lg"
                    style="background-color: var(--bg-input); border: 1px solid var(--border);"
                >
                    <span class="text-sm" style="color: var(--text-primary);">{{ item.name }}</span>
                    <span class="text-sm font-medium text-amber-400 ml-2 shrink-0">
                    {{ item.value }}
                    </span>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CharacterProficiency, ProficiencyCategory } from '@/types/character.types'

const props = defineProps<{
    proficiencies: CharacterProficiency[]
}>()

// Group proficiencies by category
const groupedProficiencies = computed(() => {
    const groups: Record<string, { proficiencyId: number; name: string; value: number }[]> = {}

    for (const prof of props.proficiencies) {
        const category = prof.proficiency.category
        
        if (!groups[category]) groups[category] = []

        groups[category].push({
            proficiencyId: prof.proficiencyId,
            name: prof.proficiency.name,
            value: prof.value
        })
    }

    const order: ProficiencyCategory[] = [
        'COMBATE', 'SOBRENATURAL', 'INVESTIGACAO', 'SOCIAL', 'PRATICA', 'ESPECIAL'
    ]

    return order
        .filter(category => (groups[category]?.length ?? 0) > 0)
        .map(category => ({ category, items: groups[category] }))
})

function categoryLabel(category: string): string {
    const labels: Record<string, string> = {
        COMBATE: 'Combate',
        SOBRENATURAL: 'Sobrenatural',
        INVESTIGACAO: 'Investigação',
        SOCIAL: 'Social',
        PRATICA: 'Prática',
        ESPECIAL: 'Especial'
    }
    return labels[category] ?? category
}
</script>