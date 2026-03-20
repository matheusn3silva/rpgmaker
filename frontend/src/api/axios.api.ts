import api from './axios.instance'
import type { LoginPayload, LoginResponse, RegisterPayload, User } from '@/types/auth.types'

export const authApi = {
    login(payload: LoginPayload) {
        return api.post<LoginResponse>('/auth/login', payload)
    },

    register(payload: RegisterPayload) {
        return api.post<LoginResponse>('/auth/register', payload)
    },

    logout() {
        return api.post('/auth/logout')
    },

    me() {
        return api.get<User>('/auth/me')
    },

    forgotPassword(email: string) {
        return api.post('/auth/forgot-password', { email })
    },

    resetPassword(token: string, password: string) {
        return api.post('/auth/reset-password', { token, password })
    }
}