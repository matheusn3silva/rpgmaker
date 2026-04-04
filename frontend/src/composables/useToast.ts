import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: number
    message: string
    type: ToastType
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
    function show(message: string, type: ToastType = 'info', duration = 3000) {
        const id = nextId++
        toasts.value.push({ id, message, type})

        setTimeout(() => {
            toasts.value = toasts.value.filter(toast => toast.id !== id)
        }, duration)
    }

    return {
        toasts,
        success: (msg: string) => show(msg, 'success'),
        error: (msg: string) => show(msg, 'error'),
        info: (msg: string) => show(msg, 'info'),
    }
}