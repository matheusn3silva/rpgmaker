export interface CharacterAttributes {
    strength: number
    dexterity: number
    consitution: number
    intelligence: number
    education: number
    presence: number
    power: number
    size: string | null
}

export interface CharacterStatus {
    lifePoints: number
    effortPoints: number
    energeyPoints: number
    exposureLevel: number
    initiative: number
    luck: number
    movement: number
    typeEnergy: string | null
}

// Versão resumida para exibição em listagem
export interface CharacterSummary {
    id: number
    name: string
    race: string
    level: number
    classId: number
    class_name: string
    createdAt: string
}

// Versão detalhada para exibição na página de detalhes
export interface Character extends CharacterSummary {
    age: number
    personality: string | null
    birthDate: string | null
    birthPlace: string | null
    residence: string | null
    occupation: string | null
    experience: number
    attributes: CharacterAttributes | null
    status: CharacterStatus | null
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