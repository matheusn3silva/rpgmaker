import api from './axios.instance'
import type { Character, PaginatedCharacters } from '@/types/character.types'

export const characterApi = {
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
    }
}
