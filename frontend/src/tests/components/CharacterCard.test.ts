import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import CharacterCard from '@/components/character/CharacterCard.vue'
import type { CharacterSummary } from '@/types/character.types'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div/>' } }]
})

const mockCharacter: CharacterSummary = {
  id: 1,
  name: 'Gandalf',
  race: 'Elfo',
  level: 10,
  classId: 1,
  class_name: 'Arquimago',
  createdAt: '2024-01-01',
  history: null,
}

describe('CharacterCard', () => {
    test('Deve exibir o nome do personagem', () => {
        const wrapper = mount(CharacterCard, {
            props: { character: mockCharacter },
            global: { plugins: [router] }
        })

        expect(wrapper.text()).toContain('Gandalf')
    })

    test('Deve exibir raça e classe', () => {
        const wrapper = mount(CharacterCard, {
            props: { character: mockCharacter },
            global: { plugins: [router] }
        })

        expect(wrapper.text()).toContain('Elfo')
        expect(wrapper.text()).toContain('Arquimago')
    })

    test('Deve exibir nível', () => {
        const wrapper = mount(CharacterCard, {
            props: { character: mockCharacter },
            global: { plugins: [router] }
        })

        expect(wrapper.text()).toContain('10')
    })

    test('Deve emitir evento delete ao clicar em Excluir', async () => {
        const wrapper = mount(CharacterCard, {
            props: { character: mockCharacter },
            global: { plugins: [router] }
        })

        await wrapper.find('button').trigger('click')

        expect(wrapper.emitted('delete')).toBeTruthy()
        expect(wrapper.emitted('delete')![0]).toEqual([1])
    })
})