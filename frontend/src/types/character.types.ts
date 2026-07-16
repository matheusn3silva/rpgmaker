export interface RPGClass {
    id: number,
    name: string,
    description: string,
    archetype: 'ASHEN' | 'SHARD' | 'LUMEN',
    sparkFormula: string
}

export interface RPGClassWithSkills extends RPGClass {
    skills: ClassSkill[]
}

export interface ClassSkill {
    id: number
    name: string
    type: 'PASSIVA' | 'ATIVA_ACAO' | 'ATIVA_BONUS' | 'ATIVA_REACAO',
    description: string
    sparkCost: number
    upgradeDescription: string | null
    emberCost: number
}

export interface CharacterSkill {
    id: number
    name: string
    type: 'ATIVA_ACAO'
    description: string
    sparkCost: number
    upgradeDescription: string | null
    emberCost: number
}

export interface CharacterAttributes {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    education: number
    presence: number
    power: number
}

export interface CharacterStatus {
    vitality: number
    spark: number
    embers: number
    soul: number
    initiative: number
    luck: number
    movement: number
    energyType: string | null
}

export type ProficiencyCategory =
    | 'COMBATE'
    | 'SOBRENATURAL'
    | 'INVESTIGACAO'
    | 'SOCIAL'
    | 'PRATICA'
    | 'ESPECIAL'

export interface Proficiency {
    id: number
    name: string
    category: ProficiencyCategory
}

export interface CharacterProficiency {
    id: number
    value: number
    proficiencyId: number
    proficiency: Proficiency
}

// Versão resumida para exibição em listagem
export interface CharacterSummary {
    id: number
    name: string
    race: string
    level: number
    classId: number
    class_name: string
    archetype: 'ASHEN' | 'SHARD' | 'LUMEN'
    createdAt: string
    history: string | null
}

// Versão detalhada para exibição na página de detalhes
export interface Character extends CharacterSummary {
    age: number
    personality: string | null
    birthDate: string | null
    birthPlace: string | null
    residence: string | null
    occupation: string | null
    coins: number
    experience: number
    height: number | null
    weight: number | null
    attributes: CharacterAttributes | null
    status: CharacterStatus | null
    proficiencies: CharacterProficiency[]
    skills: CharacterSkill[]
    sparkFormula: string | null
}

export interface PaginatedCharacters {
    data: CharacterSummary[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}