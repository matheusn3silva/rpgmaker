<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <InfoField label="Raça" :value="character.race" />
      <InfoField label="Classe" :value="character.class_name" />
      <InfoField label="Nível" :value="String(character.level)" />
      <InfoField label="Experiência" :value="String(character.experience)" />
      <InfoField label="Idade" :value="character.age ? String(character.age) : '—'" />
      <InfoField label="Ocupação" :value="character.occupation ?? '—'" />
      <InfoField label="Personalidade" :value="character.personality ?? '—'" />
      <InfoField label="Local de nascimento" :value="character.birthPlace ?? '—'" />
      <InfoField label="Residência" :value="character.residence ?? '—'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character } from '@/types/character.types'
import InfoField from './InfoField.vue'

defineProps<{ character: Character }>()
</script>