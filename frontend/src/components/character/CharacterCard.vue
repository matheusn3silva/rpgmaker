<template>
    <div 
        class="bg-slate-800 border border-slate-700 rounded-xl p-5
            hover:border-amber-700 transition-colors cursor-pointer group"
            @click="$router.push(`/characters/${character.id}`)"
    >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
            <div>
                <h3 class="text-slate-100 font-semibold group-hover:text-amber-400 transition-colors">
                    {{ character.name }}
                </h3>
                <p class="text-slate-400 text-xs mt-0.5">
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
                class="flex-1 text-center text-xs py-1.5 rounded-lg border border-slate-600
                    text-slate-400 hover:text-slate-100 hover:border-slate-400 transition-colors"
            >
                Editar
            </RouterLink>
            <button
                @click="$emit('delete', character.id)"
                class="flex-1 text-xs py-1.5 rounded-lg border border-slate-700
                    text-slate-500 hover:text-red-400 hover:border-red-900 transition-colors"
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