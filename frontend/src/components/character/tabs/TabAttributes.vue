<template>
  <div class="space-y-6">

    <!-- Main attributes -->
    <div v-if="character.attributes">
      <h3 class="text-xs text-slate-500 uppercase tracking-wider mb-3">Atributos principais</h3>
      <div class="grid grid-cols-2 gap-3">
        <AttributeBar label="Força" :value="character.attributes.strength" />
        <AttributeBar label="Destreza" :value="character.attributes.dexterity" />
        <AttributeBar label="Constituição" :value="character.attributes.constitution" />
        <AttributeBar label="Inteligência" :value="character.attributes.intelligence" />
        <AttributeBar label="Educação" :value="character.attributes.education" />
        <AttributeBar label="Presença" :value="character.attributes.presence" />
        <AttributeBar label="Poder" :value="character.attributes.power" />
      </div>
    </div>

    <!-- Status -->
    <div v-if="character.status">
      <h3 class="text-xs text-slate-500 uppercase tracking-wider mb-3">Status</h3>
      <div class="grid grid-cols-2 gap-3">
        <InfoField label="Pontos de Vida" :value="String(character.status.vitality)" />
        <InfoField label="Pontos de Centelha" :value="String(character.status.spark)" />
        <InfoField label="Pontos de Brasa" :value="String(character.status.embers)" />
        <InfoField label="Pontos de Alma" :value="String(character.status.soul)" />
        <InfoField label="Iniciativa" :value="String(character.status.initiative)" />
        <InfoField label="Sorte" :value="String(character.status.luck)" />
        <InfoField label="Movimento" :value="String(character.status.movement)" />
        <InfoField
          v-if="character.status.energyType"
          label="Tipo de Energia"
          :value="character.status.energyType"
        />
      </div>
    </div>

    <p v-if="!character.attributes && !character.status" class="text-slate-500 text-sm">
      Nenhum atributo registrado.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Character } from '@/types/character.types'
import AttributeBar from './AttributeBar.vue'
import InfoField from './InfoField.vue'

defineProps<{ character: Character }>()
</script>