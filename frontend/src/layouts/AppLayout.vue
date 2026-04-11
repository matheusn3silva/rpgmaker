<template>
    <div class="min-h-screen bg-slate-900 text-slate-100">
        <nav class="border-b border-slate-700 px-4 py-3 flex items-center justify-between">
            <RouterLink to="/characters" class="text-amber-400 font-bold tracking-widest uppercase text-sm">
                RPG Maker
            </RouterLink>

            <div class="flex items-center gap-4">
                <span class="text-slate-500 text-sm hidden sm:block">
                    {{ authStore.user?.name }}
                </span>

                <RouterLink to="/settings" class="text-slate-400 hover:text-slate-100 text-sm transition-colors">
                    Configurações
                </RouterLink>

                <button 
                    @click="handleLogout"
                    class="text-slate-400 hover:text-red-400 text-sm transition-colors"    
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