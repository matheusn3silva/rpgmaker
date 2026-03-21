import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth.api'
import type { LoginPayload, RegisterPayload, User } from '@/types/auth.types'


export const useAuthStore = defineStore('auth', () => {
    // ── State ────────────────────────────────────────────
    const user = ref<User | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // ── Getters (computed) ────────────────────────────────
    const isAuthenticated = computed(() => !!user.value)

    // ── Actions ───────────────────────────────────────────
    async function fetchMe() {
        try {
            const { data } = await authApi.me()
            user.value = data
        } catch {
            user.value = null
        }
    }

    async function login(payload: LoginPayload) {
        loading.value = true
        error.value = null
        try {
            await authApi.login(payload)
            await fetchMe() 
        } catch (err){
            error.value = (err as Error).message
            throw err
        } finally {
            loading.value = false
        }
    }

    async function register(payload: RegisterPayload) {
        loading.value = true
        error.value = null
        try {
            await authApi.register(payload)
        } catch (err) {
            error.value = (err as Error).message
            throw err
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        await authApi.logout()
        user.value = null
    }

    return {
        user,
        loading,
        error,
        isAuthenticated,
        fetchMe,
        login,
        register,
        logout,
    }
})