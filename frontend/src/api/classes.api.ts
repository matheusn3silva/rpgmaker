import api from './axios.instance'
import type { RPGClass } from '@/types/character.types'

export const classesApi = {
    getAll() {
        return api.get<RPGClass[]>('/classes')
    }
}