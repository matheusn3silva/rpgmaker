<template>
  <AppLayout>
    <div class="max-w-2xl">

      <!-- Dinamic header -->
      <div class="flex items-center gap-4 mb-6">
        <RouterLink
          to="/characters"
          class="text-slate-500 hover:text-slate-400 transition-colors text-sm"
        >
          ←
        </RouterLink>

        <h1 class="text-2xl font-bold" style="color: var(--text-primary);">
          {{ isEditing ? 'Editar personagem' : 'Novo Personagem' }}
        </h1>
      </div>

      <!-- Inicial loading edit character -->
       <div v-if="initialLoading" class="text-center py-12 text-slate-500">
        Carregando personagem...
       </div>

       <template v-else>
        <!-- Tabs Navigation -->
        <div class="flex border-b border-slate-700 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2"
            :class="activeTab === tab.id
              ? 'text-amber-400 border-amber-400'
              : 'text-slate-400 border-transparent hover:text-slate-300'"
          >
            {{ tab.label }}
            <!-- Required fields indicator -->
            <span
              v-if="tab.id === 'general' && hasGeneralErrors"
              class="w-1.5 h-1.5 rounded-full bg-red-500"
            />
          </button>
        </div>

        <!-- Tabs Content -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">

          <!-- Tab 1: General Data -->
          <div v-if="activeTab === 'general'" class="space-y-4">

            <!-- Name (Required) -->
            <div>
              <label class="block text-sm text-slate-400 mb-1">
                Nome <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Nome do personagem"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                       text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                :class="{ 'border-red-700': submitAttempted && !form.name }"
              />
            </div>

            <!-- Race and Class -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-slate-400 mb-1">
                  Raça <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.race"
                  type="text"
                  placeholder="Ex: Humano, Elfo"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                         text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  :class="{ 'border-red-700': submitAttempted && !form.race }"
                />
              </div>
              <div>
                <label class="block text-sm text-slate-400 mb-1">
                  Classe <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.classId"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                         text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  :class="{ 'border-red-700': submitAttempted && !form.classId }"
                >
                  <option :value="0" disabled>Selecione uma classe</option>
                  <option v-for="c in classes" :key="c.id" :value="c.id">
                    {{ c.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Level and Experience -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-slate-400 mb-1">Nível</label>
                <input
                  v-model.number="form.level"
                  type="number"
                  min="1"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                         text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm text-slate-400 mb-1">Experiência</label>
                <input
                  v-model.number="form.experience"
                  type="number"
                  min="0"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                         text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <!-- Age and personality -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-slate-400 mb-1">Idade</label>
                <input
                  v-model.number="form.age"
                  type="number"
                  min="0"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                         text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm text-slate-400 mb-1">Personalidade</label>
                <input
                  v-model="form.personality"
                  type="text"
                  placeholder="Ex: Corajoso, Sarcástico"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                         text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <!-- BirthDate -->
            <div>
              <label class="block text-sm text-slate-400 mb-1">Data de nascimento</label>
              <input
                v-model="form.birthDate"
                type="date"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                       text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <!-- BirthPlace and Residence -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-slate-400 mb-1">Local de nascimento</label>
                <input
                  v-model="form.birthPlace"
                  type="text"
                  placeholder="Ex: Vila dos Ventos"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                         text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm text-slate-400 mb-1">Residência</label>
                <input
                  v-model="form.residence"
                  type="text"
                  placeholder="Ex: Capital do Reino"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                         text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <!-- Occupation -->
            <div>
              <label class="block text-sm text-slate-400 mb-1">Ocupação</label>
              <input
                v-model="form.occupation"
                type="text"
                placeholder="Ex: Mercenário, Estudante de magia"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                       text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

          </div>

          <!-- Tab 2: Attributes -->
          <div v-else-if="activeTab === 'attributes'" class="space-y-4">
            <p class="text-xs text-slate-500 mb-4">Valor padrão: 10. Ajuste conforme a ficha do personagem.</p>

            <div class="grid grid-cols-2 gap-4">
              <NumberField label="Força" v-model="form.strength" />
              <NumberField label="Destreza" v-model="form.dexterity" />
              <NumberField label="Constituição" v-model="form.constitution" />
              <NumberField label="Inteligência" v-model="form.intelligence" />
              <NumberField label="Educação" v-model="form.education" />
              <NumberField label="Presença" v-model="form.presence" />
              <NumberField label="Poder" v-model="form.power" />
            </div>

            <div>
              <label class="block text-sm text-slate-400 mb-1">Tamanho</label>
              <input
                v-model="form.size"
                type="text"
                placeholder="Ex: Médio, Grande"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                       text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <!-- Tab 3: Status -->
          <div v-else-if="activeTab === 'status'" class="space-y-4">

            <div class="grid grid-cols-2 gap-4">
              <NumberField label="Pontos de Vida" v-model="form.lifePoints" />
              <NumberField label="Pontos de Esforço" v-model="form.effortPoints" />
              <NumberField label="Pontos de Energia" v-model="form.energyPoints" />
              <NumberField label="Nível de Exposição" v-model="form.exposureLevel" />
              <NumberField label="Iniciativa" v-model="form.initiative" />
              <NumberField label="Sorte" v-model="form.luck" />
              <NumberField label="Movimento" v-model="form.movement" />
            </div>

            <div>
              <label class="block text-sm text-slate-400 mb-1">Tipo de Energia</label>
              <input
                v-model="form.typeEnergy"
                type="text"
                placeholder="Ex: Arcana, Divina"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                       text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

        </div>

        <!-- Error message -->
        <p v-if="errorMessage" class="text-red-400 text-sm mb-4">{{ errorMessage }}</p>

        <!-- Required Fields Warning -->
        <p v-if="submitAttempted && hasGeneralErrors" class="text-amber-400 text-sm mb-4">
          Preencha os campos obrigatórios na aba "Dados Gerais" antes de salvar.
        </p>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <RouterLink
            to="/characters"
            class="flex-1 text-center py-2.5 text-sm border border-slate-600 text-slate-400
                   hover:text-slate-100 hover:border-slate-400 rounded-lg transition-colors"
          >
            Cancelar
          </RouterLink>
          <button
            @click="handleSubmit"
            :disabled="submitting"
            class="flex-1 py-2.5 text-sm bg-amber-600 hover:bg-amber-500 disabled:opacity-50
                   text-white font-medium rounded-lg transition-colors"
          >
            {{ submitting ? 'Salvando...' : (isEditing ? 'Salvar alterações' : 'Criar personagem') }}
          </button>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import NumberField from '@/components/ui/NumberField.vue'
import { charactersApi } from '@/api/characters.api'
import { classesApi } from '@/api/classes.api'
import type { RPGClass } from '@/types/character.types'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const route = useRoute()
const router = useRouter()

// ── Modo da tela ──────────────────────────────────────────
const characterId = route.params.id ? Number(route.params.id) : null
const isEditing = computed(() => characterId !== null)

// ── Estado ───────────────────────────────────────────────
const initialLoading = ref(false)
const submitting = ref(false)
const submitAttempted = ref(false)
const errorMessage = ref('')
const classes = ref<RPGClass[]>([])

type TabId = 'general' | 'attributes' | 'status'
const activeTab = ref<TabId>('general')
const tabs: { id: TabId; label: string }[] = [
  { id: 'general',    label: 'Dados Gerais' },
  { id: 'attributes', label: 'Atributos' },
  { id: 'status',     label: 'Status' },
]

// ── Formulário — estado único e flat ─────────────────────
const form = ref({
  // Dados gerais
  name: '',
  race: '',
  classId: 0,
  level: 1,
  experience: 0,
  age: 0,
  personality: '',
  birthDate: '',
  birthPlace: '',
  residence: '',
  occupation: '',
  // Atributos
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  education: 10,
  presence: 10,
  power: 10,
  size: '',
  // Status
  lifePoints: 20,
  effortPoints: 1,
  energyPoints: 1,
  exposureLevel: 5,
  initiative: 0,
  luck: 0,
  movement: 1,
  typeEnergy: '',
})

// ── Validação ─────────────────────────────────────────────
const hasGeneralErrors = computed(() =>
  !form.value.name || !form.value.race || !form.value.classId
)

// ── Inicialização ─────────────────────────────────────────
onMounted(async () => {
  try {
    const { data } = await classesApi.getAll()
    classes.value = data
  } catch {
    errorMessage.value = 'Erro ao carregar classes.'
  }

  if (isEditing.value && characterId) {
    initialLoading.value = true
    try {
      const { data } = await charactersApi.getById(characterId)

      form.value.name        = data.name
      form.value.race        = data.race
      form.value.classId     = data.classId
      form.value.level       = data.level
      form.value.experience  = data.experience
      form.value.age         = data.age ?? 0
      form.value.personality = data.personality ?? ''
      form.value.birthPlace  = data.birthPlace ?? ''
      form.value.residence   = data.residence ?? ''
      form.value.occupation  = data.occupation ?? ''

      form.value.birthDate = data.birthDate?.split('T')[0] ?? '';


      if (data.attributes) {
        form.value.strength      = data.attributes.strength
        form.value.dexterity     = data.attributes.dexterity
        form.value.constitution  = data.attributes.constitution
        form.value.intelligence  = data.attributes.intelligence
        form.value.education     = data.attributes.education
        form.value.presence      = data.attributes.presence
        form.value.power         = data.attributes.power
        form.value.size          = data.attributes.size ?? ''
      }

      // Status
      if (data.status) {
        form.value.lifePoints    = data.status.lifePoints
        form.value.effortPoints  = data.status.effortPoints
        form.value.energyPoints  = data.status.energyPoints
        form.value.exposureLevel = data.status.exposureLevel
        form.value.initiative    = data.status.initiative
        form.value.luck          = data.status.luck
        form.value.movement      = data.status.movement
        form.value.typeEnergy    = data.status.typeEnergy ?? ''
      }

    } catch {
      errorMessage.value = 'Erro ao carregar personagem.'
    } finally {
      initialLoading.value = false
    }
  }
})

// ── Submit ────────────────────────────────────────────────
async function handleSubmit() {
  submitAttempted.value = true
  errorMessage.value = ''

  if (hasGeneralErrors.value) {
    activeTab.value = 'general' 
    return
  }

  submitting.value = true
  try {
    const payload = {
      ...form.value,
      personality: form.value.personality || undefined,
      birthDate:   form.value.birthDate   || undefined,
      birthPlace:  form.value.birthPlace  || undefined,
      residence:   form.value.residence   || undefined,
      occupation:  form.value.occupation  || undefined,
      size:        form.value.size        || undefined,
      typeEnergy:  form.value.typeEnergy  || undefined,
    }

    if (isEditing.value && characterId) {
      await charactersApi.update(characterId, payload)
      router.push(`/characters/${characterId}`)
      toast.success('Personagem atualizado com sucesso!')
    } else {
      const { data } = await charactersApi.create(payload)
      router.push(`/characters/${data.id}`)
      toast.success('Personagem criado com sucesso!')
    }
  } catch (err) {
    toast.error((err as Error).message || 'Erro ao salvar personagem.')
  } finally {
    submitting.value = false
  }
}
</script>