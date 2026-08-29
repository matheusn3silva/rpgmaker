<template>
  <div class="space-y-4">
    <div class="flex justify-center">
      <div class="w-32 h-32 rounded-lg border border-slate-600 overflow-hidden bg-slate-700
                  flex items-center justify-center">
        <img
          v-if="character.photoUrl"
          :src="character.photoUrl"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-slate-500 text-xs">Sem foto</span>
      </div>
    </div>

    <h3 class="text-xs flex gap-2 align-center uppercase tracking-wider mb-3 text-amber-500 font-bold">Informações Gerais</h3>
    <div class="grid grid-cols-2 gap-4">
      <InfoField label="Raça" :value="character.race" />
      <InfoField label="Classe" :value="character.class_name" />
      <InfoField label="Grau de Força" :value="String(character.level)" />
      <InfoField label="Idade" :value="character.age ? String(character.age) : '—'" />
      <InfoField label="Ocupação" :value="character.occupation ?? '—'" />
      <InfoField label="Personalidade" :value="character.personality ?? '—'" />
      <InfoField label="Moedas Luminar" :value="String(character.coins ?? '—')" />
      <InfoField label="Altura (Metros)" :value="String(character.height ?? '—')" />
      <InfoField label="Peso (KG)" :value="String(character.weight ?? '—')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character } from '@/types/character.types'
import InfoField from './InfoField.vue'

defineProps<{ character: Character }>()
</script>