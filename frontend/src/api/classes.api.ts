import api from './axios.instance'
import type { RPGClass, RPGClassWithSkills } from '@/types/character.types'

export const classesApi = {
    getAll() {
        return api.get<RPGClass[]>('/classes')
    },

    getById(id: number) {
        return api.get<RPGClassWithSkills>(`/classes/${id}`)
    }
}