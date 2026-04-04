<template>
  <div>
    <div class="flex justify-between mb-1">
      <span class="text-xs text-gray-500">{{ label }}</span>
      <span class="text-xs text-amber-400 font-medium">{{ value }}</span>
    </div>
    <!-- Barra de progresso: max considerado 20 para atributos padrão -->
    <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
      <div
        class="h-full bg-amber-600 rounded-full transition-all duration-500"
        :style="{ width: `${Math.min((value / 100) * 100, 100)}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: number }>()
</script>