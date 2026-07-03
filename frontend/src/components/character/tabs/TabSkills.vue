<template>
    <div class="space-y-6">

        <!-- Player Skill -->
        <div>
            <h3 class="text-xs text-slate-500 uppercase tracking-wider mb-3">Habilidade Ativa (Personagem)</h3>

            <div v-if="characterSkill" class="rouded-lg p-4"
                style="background-color: var(--bg-input); border: 1px solid var(--border);">
                <div class="flex -items-start justify-between gap-3 mb-2">
                    <span class="font-medium text-sm" style="color: var(--text-primary)">
                        {{ characterSkill.name }}
                    </span>

                    <span class="text-xs px-x py-0.5 rounded shrink-0"
                        style="background-color: #3b1f0a; color: #fbbf24;">
                        Ação
                    </span>
                </div>

                <p class="text-xs mb-3" style="color: var(--text-muted)">
                    {{ characterSkill.description }}
                </p>

                <div class="flex gap-3">
                    <span v-if="characterSkill.sparkCost > 0" class="text-xs" style="color: var(--text-faint);">
                        Centelhas: <span class="text-amber-400 font-medium">{{ characterSkill.sparkCost }}</span>
                    </span>
                    <span v-if="characterSkill.emberCost > 0" class="text-xs" style="color: var(--text-faint)">
                        Brasas: <span class="text-amber-400 font-medium">{{ characterSkill.emberCost }}</span>
                    </span>
                    <span v-if="characterSkill.sparkCost === 0 && characterSkill.emberCost === 0" class="text-xs" style="color: var(--text-faint);">
                        Sem custo
                    </span>
                </div>

                <div v-if="characterSkill.upgradeDescription" class="mt-3 rounded-lg p-3" style="background-color: var(--bg-surface); border: 1px solid var(--border);">
                    <p class="text-xs font-medium uppercase tracking-wider mb-1" style="color: var(--text-faint);">
                        Aprimoramento
                        <span v-if="characterSkill.upgradeCost > 0" class="ml-1 text-amber-400">
                        · {{ characterSkill.upgradeCost }} {{ characterSkill.upgradeType === 'BRASA' ? 'Brasas' : 'Centelhas' }}
                        </span>
                    </p>
                    <p class="text-xs" style="color: var(--text-muted);">{{ characterSkill.upgradeDescription }}</p>
                </div>
            </div>

            <!-- No Skill Created -->
            <div v-else class="rounded-lg p-4 text-center" style="background-color: var(--bg-input); border: 1px solid var(--border);">
                <p class="text-xs" style="color: var(--text-faint);">
                    Nenhuma habilidade ativa criada.
                </p>
                <RouterLink
                    :to="`/characters/${characterId}/edit`"
                    class="text-xs mt-1 inline-block"
                    style="color: #f59e0b;"
                >
                    Criar Habilidade
                </RouterLink>
            </div>
        </div>

        <!-- Classes Skills -->
        <div>
            <h3 class="text-xs text-slate-500 uppercase tracing-wider mb-3">
                Habilidades de Classe
            </h3>

            <div v-if="loadingClassSkills" class="text-center py-4" style="color: var(--text-faint)">
                Carregando habilidades de classe...
            </div>

            <div v-else-if="classSkills.length === 0" class="text-center py-4" style="color: var(--text-faint)">
                Nenhuma habilidade de classe encontrada.
            </div>

            <div v-else class="space-y-3">
                <div
                    v-for="skill in classSkills"
                    :key="skill.id"
                    class="rounded-lg p-4"
                    style="background-color: var(--bg-input); border: 1px solid var(--border);"
                >
                    <!-- Name and type -->
                    <div class="flex items-start justify-between gap-3 mb-2">
                        <span class="font-medium text-sm" style="color: var(--text-primary)">
                            {{  skill.name  }}
                        </span>

                        <span class="text-xs px-2 py-0.5 rounded shrink-0" :style="skillTypeStyle(skill.type)">
                            {{  skillTypeLabel(skill.type) }}
                        </span>
                    </div>

                    <!-- Description -->
                    <p class="text-xs mb-3" style="color: var(--text-muted)">
                        {{  skill.description  }}
                    </p>

                    <!-- Cost -->
                    <div class="flex gap-3">
                        <span v-if="skill.sparkCost > 0" class="text-xs" style="color: var(--text-faint)">
                            Centelhas: <span class="text-amber-400 font-medium">{{ skill.sparkCost }}</span>
                        </span>

                        <span v-if="skill.emberCost > 0" class="text-xs" style="color: var(--text-faint);">
                            Brasas: <span class="text-amber-400 font-medium">{{ skill.emberCost }}</span>
                        </span>

                        <span v-if="skill.sparkCost === 0 && skill.emberCost === 0" class="text-xs" style="color: var(--text-faint);">
                            Sem custo
                        </span>
                    </div>

                    <!-- Upgraded -->
                    <div v-if="skill.upgradeDescription" class="mt-3 rounded-lg p-3" style="background-color: var(--bg-surface); border: 1px solid var(--border);">
                        <p class="text-xs font-medium uppercase tracking-wider mb-1" style="color: var(--text-faint);">
                            Aprimoramento com Brasa
                            <span v-if="skill.upgradeCost > 0" class="text-amber-400 ml-1">
                                · {{ skill.upgradeCost }} {{ skill.upgradeType === 'BRASA' ? 'Brasas' : 'Centelhas' }}
                            </span>
                        </p>
                        <p class="text-xs italic" style="color: var(--text-muted);">
                            {{ skill.upgradeDescription }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { classesApi } from '@/api/classes.api';
import type { CharacterSkill, ClassSkill } from '@/types/character.types'

const props = defineProps<{
    characterId: number
    classId: number
    characterSkill: CharacterSkill | null
}>()

const classSkills = ref<ClassSkill[]>([])
const loadingClassSkills = ref<boolean>(true)

onMounted(async () => {
    try {
        const { data } = await classesApi.getById(props.classId)
        classSkills.value = data.skills ?? []
    } catch {
        classSkills.value = []
    } finally {
        loadingClassSkills.value = false
    }
})

function skillTypeLabel(type: string) {
    const labels: Record<string, string> = {
        PASSIVA: 'Passiva',
        ATIVA_ACAO: 'Ação',
        ATIVA_BONUS: 'Bônus',
        ATIVA_REACAO: 'Reação',
    }

    return labels[type] ?? type
}

function skillTypeStyle(type: string) {
    const styles: Record<string, string> = {
        PASSIVA:      'background-color: #1e3a5f; color: #93c5fd;',
        ATIVA_ACAO:   'background-color: #3b1f0a; color: #fbbf24;',
        ATIVA_BONUS:  'background-color: #14532d; color: #86efac;',
        ATIVA_REACAO: 'background-color: #4a0505; color: #fca5a5;',
    }

    return styles[type] ?? 'background-color: var(--bg-input); color: var(--text-muted);'
}
</script>