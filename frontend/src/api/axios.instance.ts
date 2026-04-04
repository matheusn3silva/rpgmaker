// src/api/axios.instance.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Sem resposta do servidor = problema de rede ou backend fora do ar
    if (!error.response) {
      return Promise.reject(new Error('Não foi possível conectar ao servidor. Verifique sua conexão.'))
    }

    const status = error.response.status
    const backendMessage = error.response.data?.message

    // Se o backend enviou uma mensagem legível, usa ela
    // Caso contrário, usa uma mensagem amigável baseada no status HTTP
    const message = backendMessage ?? getFriendlyMessage(status)

    return Promise.reject(new Error(message))
  }
)

function getFriendlyMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Os dados enviados são inválidos.',
    401: 'Você precisa estar logado para fazer isso.',
    403: 'Você não tem permissão para realizar essa ação.',
    404: 'O recurso solicitado não foi encontrado.',
    409: 'Já existe um registro com esses dados.',
    422: 'Os dados enviados não puderam ser processados.',
    429: 'Muitas tentativas. Aguarde um momento e tente novamente.',
    500: 'Erro interno do servidor. Tente novamente em alguns instantes.',
    502: 'Servidor indisponível no momento. Tente novamente em breve.',
    503: 'Serviço temporariamente indisponível.',
  }

  return messages[status] ?? `Erro inesperado (${status}). Tente novamente.`
}

export default api