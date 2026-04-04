import { defineStore } from "pinia"
import { ref } from 'vue'
import { charactersApi } from "@/api/characters.api"
import type { Character, CharacterSummary, PaginatedCharacters } from '@/types/character.types'


export const useCharacterStore = defineStore('character', () => {
    const characters = ref<CharacterSummary[]>([])

    const pagination = ref<PaginatedCharacters['pagination'] | null>(null)

    const currentCharacter = ref<Character | null>(null)
    
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchCharacters(page = 1) {
        loading.value = true
        error.value = null

        try {
            const { data } = await charactersApi.getAll(page)
            characters.value = data.data
            pagination.value = data.pagination
        } catch (err) {
            error.value = (err as Error).message
        } finally {
            loading.value = false
        }
    }

    async function deleteCharacter(id: number) {
        await charactersApi.delete(id)

        characters.value = characters.value.filter(char => char.id !== id)

        if (!pagination.value) return

        if (characters.value.length === 0 && pagination.value.page > 1) {
            await fetchCharacters(pagination.value.page - 1)
        }
    }

    async function fetchCharacterById(id: number) {
        loading.value = true
        error.value = null
        currentCharacter.value = null
        try {
            const { data } = await charactersApi.getById(id)
            currentCharacter.value = data
        } catch (err) {
            error.value = (err as Error).message
        } finally {
            loading.value = false
        }
    }

    return { characters, pagination, loading, error, currentCharacter, fetchCharacters, deleteCharacter, fetchCharacterById }
})