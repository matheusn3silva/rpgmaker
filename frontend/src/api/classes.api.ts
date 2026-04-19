import api from './axios.instance'
import type { RPGClass } from '@/types/character.types'

interface RPGClassWithSkills extends RPGClass {
    skills: {
        id: number
        name: string
        type: string
        description: string
        psCost: number
        peCost: number
    }[]
}

export const classesApi = {
    getAll() {
        return api.get<RPGClass[]>('/classes')
    },

    getById(id: number) {
        return api.get<RPGClassWithSkills>(`/classes/${id}`)
    }
}