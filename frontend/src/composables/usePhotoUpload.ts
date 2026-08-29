import { ref } from 'vue'
import { charactersApi } from '@/api/characters.api'

export function usePhotoUpload() {
    const previewUrl = ref<string | null>(null)
    const uploading = ref(false)
    const error = ref('')
    let selectedFile: File | null = null

    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement
        const file = input.files?.[0]
        if (!file) return

        error.value = ''

        const allowed = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowed.includes(file.type)) {
            error.value = 'Formato não suportado. Use JPG, PNG ou WebP'
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            error.value = 'Imagem muito grande (máximo 5MB).'
            return
        }

        selectedFile = file
        previewUrl.value = URL.createObjectURL(file)
    }
    
    async function upload(characterId: number): Promise<string | null> {
        if (!selectedFile) return null

        uploading.value = true
        error.value = ''

        try {
            const { data } = await charactersApi.uploadPhoto(characterId, selectedFile)
            return data.photoUrl
        } catch {
            error.value = 'Erro ao enviar a foto.'
            return null
        } finally {
            uploading.value = false
        }
    }


    function reset() {
        if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = null
        selectedFile = null
        error.value = ''
    }

    return { previewUrl, uploading, error, handleFileSelect, upload, reset }
}