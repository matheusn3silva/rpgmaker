<template>
  <div>
    <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">{{ label }}</p>
    <p class="text-slate-200 text-sm">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string }>()
</script>