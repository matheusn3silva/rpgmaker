<template>
  <div>
    <label class="block text-sm text-slate-400 mb-1">{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      type="number"
      :min="min"
      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
             text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  modelValue: number
  min?: number
}>()

defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>