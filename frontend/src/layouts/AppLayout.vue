<template>
    <div
        class="min-h-screen transition-colors duration-200"
        style="background-color: var(--bg-page); color: var(--text-primary);"
    >
        <nav 
            class="px-4 py-3 flex items-center justify-between"
            style="border-bottom: 1px solid var(--border);"
        >
            <RouterLink 
                to="/characters"
                style="color: #f59e0b;"
                class="font-bold tracking-widest uppercase text-sm"
            >
                RPG Maker
            </RouterLink>

            <div class="flex items-center gap-4">
                <span class="text-sm hidden sm:block" style="color: var(--text-faint);">
                    {{ authStore.user?.name }}
                </span>

                <RouterLink 
                    to="/settings" 
                    class="text-sm transition-colors"
                    style="color: var(--text-muted);"
                >
                    Configurações
                </RouterLink>

                <button 
                    @click="handleLogout"
                    class="text-sm transition-colors hover:text-red-400"
                    style="color: var(--text-muted);"   
                >
                    Desconectar
                </button>
            </div>
        </nav>

        <main class="container mx-auto px-4 py-6 max-w-4xl">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
    await authStore.logout()
    router.push('/login')
}
</script>