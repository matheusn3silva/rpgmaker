<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
      <h2 class="text-lg font-bold text-slate-100 mb-1">
        {{ editingSkill ? 'Editar habilidade' : 'Nova habilidade' }}
      </h2>
      <p class="text-xs text-slate-500 mb-4">
        Esta é uma habilidade ativa exclusiva. Ela aparece na ficha junto às habilidades da classe.
      </p>

      <div class="space-y-4">
        <div>
          <label class="block text-sm text-slate-400 font-semibold mb-1">Nome da Habilidade</label>
          <input v-model="localSkill.name" type="text" placeholder="Ex: Golpe Fantasma"
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors" />
        </div>

        <div>
          <label class="block text-sm text-slate-400 font-semibold mb-1">Descrição</label>
          <textarea v-model="localSkill.description" rows="3" placeholder="Descreva o efeito da habilidade..." class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
              text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none" />
        </div>

        <NumberField label="Custo de Centelha" v-model="localSkill.sparkCost" />

        <div class="pt-2 border-t border-slate-700">
          <p class="text-xs text-slate-500 mb-3">Aprimoramento com Brasa (Opcional)</p>
          <div class="space-y-3">
            <div>
              <label class="block text-sm text-slate-400 mb-1">Descrição do aprimoramento</label>
              <textarea v-model="localSkill.upgradeDescription" rows="2"
                placeholder="Efeito melhorado ao gastar Brasas..." class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none" />
            </div>
            <NumberField label="Custo de Brasa" v-model="localSkill.emberCost" />
          </div>
        </div>
      </div>

      <p v-if="validationError" class="text-red-400 text-xs mt-3">{{ validationError }}</p>

      <div class="flex gap-3 mt-6">
        <button @click="$emit('close')" type="button" class="flex-1 py-2.5 text-sm border border-slate-600 text-slate-400
                 hover:text-slate-100 hover:border-slate-400 rounded-lg transition-colors">
          Cancelar
        </button>
        <button @click="handleSave" type="button" class="flex-1 py-2.5 text-sm bg-amber-600 hover:bg-amber-500
                 text-white font-medium rounded-lg transition-colors">
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import NumberField from '@/components/ui/NumberField.vue'
import type { SkillDraft } from '@/types/character.types'

const props = defineProps<{ editingSkill?: SkillDraft | null }>()
const emit = defineEmits<{
  save: [skill: Omit<SkillDraft, 'tempId'>]
  close: []
}>()

const validationError = ref('')
const localSkill = ref({
  name: '',
  description: '',
  sparkCost: 0,
  emberCost: 0,
  upgradeDescription: '',
})

watch(() => props.editingSkill, (skill) => {
  localSkill.value = {
    name: skill?.name ?? '',
    description: skill?.description ?? '',
    sparkCost: skill?.sparkCost ?? 0,
    emberCost: skill?.emberCost ?? 0,
    upgradeDescription: skill?.upgradeDescription ?? '',
  }
  validationError.value = ''
}, { immediate: true })

function handleSave() {
  if (!localSkill.value.name || !localSkill.value.description) {
    validationError.value = 'Nome e descrição são obrigatórios.'
    return
  }
  emit('save', { id: props.editingSkill?.id, ...localSkill.value })
}
</script>