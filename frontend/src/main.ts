import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useThemeStore } from '@/stores/theme.store'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())

const themeStore = useThemeStore()
themeStore.setTheme(themeStore.theme)

app.use(router)
app.mount('#app')
