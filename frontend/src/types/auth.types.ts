export interface User {
    id: number
    name: string
    email: string
}

export interface LoginResponse {
    message: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    name: string
    email: string
    password: string
}