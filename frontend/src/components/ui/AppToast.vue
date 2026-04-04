<template>
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <TransitionGroup name="toast">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="px-4 py-3 rounded-xl text-sm font-medium shadow-lg pointer-events-auto max-w-sm"
                :class="{
                    'bg-green-900 border border-green-700 text-green-200': toast.type === 'success',
                    'bg-red-900 border border-red-700 text-red-200':       toast.type === 'error',
            'bg-gray-800 border border-gray-700 text-gray-200':    toast.type === 'info',
                }"
            >
                {{ toast.message }}
            </div>
        </TransitionGroup>
    </div>
</template>

<script lang="ts" setup>
import { useToast } from '@/composables/useToast'
const { toasts } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>