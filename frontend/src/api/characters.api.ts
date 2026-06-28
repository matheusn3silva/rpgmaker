import api from './axios.instance'
import type { Character, PaginatedCharacters } from '@/types/character.types'

export const charactersApi = {
    getAll(page = 1, limit = 5) {
        return api.get<PaginatedCharacters>('/characters', {
            params: { page, limit }
        })
    },

    getById(id: number) {
        return api.get<Character>(`/characters/${id}`)
    },

    delete(id: number) {
        return api.delete(`/characters/${id}`)
    },

    create(payload: Record<string, unknown>) {
        return api.post<{ id: number }>('/characters', payload)
    },

    update(id: number, payload: Record<string, unknown>) {
        return api.put(`/characters/${id}`, payload)
    },

    createSkill(characterId: number, payload: Record<string, unknown>) {
        return api.post(`/characters/${characterId}/skills`, payload)
    },
    
    updateSkill(characterId: number, skillId: number, payload: Record<string, unknown>) {
        return api.put(`/characters/${characterId}/skills/${skillId}`, payload)
    },

    deleteSkill(characterId: number, skillId: number) {
        return api.delete(`/characters/${characterId}/skills/${skillId}`)
    }
}
