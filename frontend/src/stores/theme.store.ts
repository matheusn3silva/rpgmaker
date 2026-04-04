import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type Theme = 'dark' | 'light'

export const useThemeStore = defineStore('theme', () => {
    const saved = localStorage.getItem('theme') as Theme | null
    const theme = ref<Theme>(saved ?? 'dark')

    function applyTheme(t: Theme) {
        document.documentElement.classList.toggle('dark', t === 'dark')
    }

    function setTheme(t: Theme) {
        theme.value = t
        localStorage.setItem('theme', t)
        applyTheme(t)
    }

    watch(theme, applyTheme, { immediate: true })

    return { theme, setTheme }
})