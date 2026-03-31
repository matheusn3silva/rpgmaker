import api from './axios.instance'

export const userApi = {
    updateName(name: string) {
        return api.put('/user/name',  { name })
    },

    updatePassword(currentPassword: string, newPassword: string) {
        return api.put('/user/password', { currentPassword, newPassword })
    }
}