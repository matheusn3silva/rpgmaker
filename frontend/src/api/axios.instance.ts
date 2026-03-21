import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API ?? 'http://localhost:3000/',
    withCredentials: true,
})

// Interceptor de resposta: trata erros globalmente
api.interceptors.request.use(
    // Sucesso: passa direto
    (response) => response,

    // Erro: extrai a mensagem do backend antes de repassar
    (error) => {
        const message = error.response?.data?.message || 'Erro inesperado. Tente novamente.'

         // Repassa o erro enriquecido — cada chamada ainda pode tratar individualmente
        return Promise.reject(new Error(message))
    }
)

export default api