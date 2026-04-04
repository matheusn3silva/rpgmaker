<template>
  <div>
    <label class="block text-sm text-gray-400 mb-1">{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      type="number"
      :min="min"
      class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
             text-gray-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
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