/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'

vi.mock('@/api/auth.api', () => ({
    authApi: {
        login: vi.fn(),
        logout: vi.fn(),
        me: vi.fn(),
        register: vi.fn(),
    }
}))

import { authApi } from '@/api/auth.api'

beforeEach(() => {
    // Cria uma Pinia limpa para cada teste
    // sem isso, o estado de um teste vaza para o próximo
    setActivePinia(createPinia())
    vi.clearAllMocks()
})

describe('auth store', () => {
    test('isAuthenticated deve ser false inicialmente', () => {
        const store = useAuthStore()
        expect(store.isAuthenticated).toBe(false)
        expect(store.user).toBeNull()
    })

    test('login bem-sucedido deve setar o usuário', async () => {
        const mockUser = { id: 1, name: 'Manasi', email: 'manasi@test.com' }

        vi.mocked(authApi.login).mockResolvedValue({ data: { message: 'ok' } } as any)
        vi.mocked(authApi.me).mockResolvedValue({ data: mockUser } as any)

        const store = useAuthStore()
        await store.login({ email: 'manasi@test.com', 'password': 'senha123' })

        expect(store.user).toEqual(mockUser)
        expect(store.isAuthenticated).toBe(true)
        expect(store.loading).toBe(false)
    })

    test('logout deve limpar o usuário', async () => {
        vi.mocked(authApi.logout).mockResolvedValue({ data: {} } as any)

        const store = useAuthStore()
        store.user = { id: 1, name: 'Manasi', email: 'test@test.com' }

        await store.logout()

        expect(store.user).toBeNull()
        expect(store.isAuthenticated).toBe(false)
    })

    test('fetchMe com erro deve manter usuário como null', async () => {
        vi.mocked(authApi.me).mockRejectedValue(new Error('Não autenticado'))

        const store = useAuthStore()
        await store.fetchMe()

        expect(store.user).toBeNull()
    })
})