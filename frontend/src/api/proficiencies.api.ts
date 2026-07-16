import api from './axios.instance'
import type { Proficiency } from '@/types/character.types'

export const proficienciesApi = {
    getAll() {
        return api.get<Proficiency[]>('/proficiencies')
    }
}