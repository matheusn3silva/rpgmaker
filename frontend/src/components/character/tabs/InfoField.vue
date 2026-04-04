<template>
  <div>
    <p class="text-xs text-gray-600 uppercase tracking-wider mb-1">{{ label }}</p>
    <p class="text-gray-200 text-sm">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string }>()
</script>