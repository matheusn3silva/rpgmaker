<template>
  <div class="space-y-6">

    <!-- Foto + Resumo -->
    <div class="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      <div class="w-32 h-32 rounded-lg border border-slate-600 overflow-hidden bg-slate-700
                  flex items-center justify-center shrink-0">
        <img
          v-if="character.photoUrl"
          :src="character.photoUrl"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-slate-500 text-xs">Sem foto</span>
      </div>

      <div class="flex flex-col items-center sm:items-start gap-3 pt-1 w-full">
        <span class="inline-block px-3 py-1 rounded-lg text-sm font-bold
                     bg-amber-900/40 text-amber-400 border border-amber-800/50">
          Grau {{ character.level }}
        </span>

        <p class="text-lg font-medium text-slate-200">
          {{ character.race }} <span class="text-slate-600">·</span> {{ character.class_name }}
        </p>

        <!-- Status rápido -->
        <div v-if="character.status" class="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
          <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                       bg-slate-700/60 border border-slate-600">
            <span class="text-red-400 font-semibold">{{ character.status.vitality }}</span>
            <span class="text-slate-400">Vitalidade</span>
          </span>
          <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                       bg-slate-700/60 border border-slate-600">
            <span class="text-blue-400 font-semibold">{{ character.status.spark }}</span>
            <span class="text-slate-400">Centelha</span>
          </span>
          <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                       bg-slate-700/60 border border-slate-600">
            <span class="text-orange-400 font-semibold">{{ character.status.embers }}</span>
            <span class="text-slate-400">Brasa</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Demais informações -->
    <div>
      <h3 class="text-xs flex gap-2 align-center uppercase tracking-wider mb-3 text-amber-500 font-bold">
        Informações Gerais
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoField label="Idade" :value="character.age ? String(character.age) : '—'" />
        <InfoField label="Ocupação" :value="character.occupation ?? '—'" />
        <InfoField label="Personalidade" :value="character.personality ?? '—'" />
        <InfoField label="Moedas Luminar" :value="String(character.coins ?? '—')" />
        <InfoField label="Altura (Metros)" :value="String(character.height ?? '—')" />
        <InfoField label="Peso (KG)" :value="String(character.weight ?? '—')" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Character } from '@/types/character.types'
import InfoField from './InfoField.vue'

defineProps<{ character: Character }>()
</script>