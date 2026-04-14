<template>
    <div 
        class="rounded-xl p-5 cursor-pointer group transition-colors"
        style="background-color: var(--bg-surface); border: 1px solid var(--border);"
        @click="$router.push(`/characters/${character.id}`)"
    >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
            <div>
                <h3 
                    class="font-semibold group-hover:text-amber-400 transition-colors"
                    style="color: var(--text-primary);"    
                >
                    {{ character.name }}
                </h3>
                <p class="text-xs mt-0.5" style="color: var(--text-faint);">
                    {{ character.race }} · {{ character.class_name }}
                </p>
            </div>
            <span class="text-amber-400 text-sm font-medium bg-amber-950 px-2 py-0.5 rounded">
                Nv. {{ character.level }}
            </span>
        </div>

        <div class="flex gap-2 mt-4" @click.stop>
            <RouterLink 
                :to="`/characters/${character.id}/edit`"
                class="flex-1 text-center text-xs py-1.5 rounded-lg transition-colors"
                style="border: 1px solid var(--border); color: var(--text-muted);"
            >
                Editar
            </RouterLink>
            <button
                @click="$emit('delete', character.id)"
                class="flex-1 text-xs py-1.5 rounded-lg transition-colors hover:text-red-400"
                style="border: 1px solid var(--border); color: var(--text-faint);"
            >
                Excluir
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CharacterSummary } from '@/types/character.types'

defineProps<{
    character: CharacterSummary
}>()

defineEmits<{
    delete: [id: number]
}>()
</script>