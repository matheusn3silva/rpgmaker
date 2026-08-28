<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">

      <!-- Dinamic header -->
      <div class="flex items-center gap-4 mb-6">
        <RouterLink to="/characters"
          class="px-2 py-1 font-extrabold text-slate-500 hover:text-slate-400 transition-colors text-sm">
          <<<< </RouterLink>

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
        <NavTabs ref="navTabsRef" />

        <!-- Tabs Content -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">

          <!-- Tab 1: General Data -->
          <div v-if="activeTab === 'general'" class="space-y-4">

            <div class="flex flex-col justify-center items-center">
              <label class="block text-sm text-slate-400 mb-1">Foto do personagem</label>

              <div class="w-32 h-32 rounded-lg border border-slate-600 overflow-hidden bg-slate-700
                          flex items-center justify-center">
                <img v-if="photoUpload.previewUrl.value || existingPhotoUrl"
                  :src="photoUpload.previewUrl.value || existingPhotoUrl" class="w-full h-full object-cover m-auto" />
                <span v-else class="text-slate-500 text-xs">Sem foto</span>
              </div>

              <input type="file" accept="image/jpeg,image/png,image/webp" @change="photoUpload.handleFileSelect"
                class="mt-2 text-xs text-slate-300 border  rounded-xs p-2 cursor-pointer" />

              <p v-if="photoUpload.error.value" class="text-red-400 text-xs mt-1">
                {{ photoUpload.error.value }}
              </p>
            </div>

            <!-- Name (Required) -->
            <div>
              <label class="block text-sm text-slate-400 mb-1">
                Nome <span class="text-red-500">*</span>
              </label>
              <input v-model="form.name" type="text" placeholder="Nome do personagem" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                       text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                :class="{ 'border-red-700': submitAttempted && !form.name }" />
            </div>

            <!-- Race and Class -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-slate-400 mb-1">
                  Raça <span class="text-red-500">*</span>
                </label>
                <input v-model="form.race" type="text" placeholder="Ex: Humano, Elfo" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
             text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  :class="{ 'border-red-700': submitAttempted && !form.race }" />
              </div>
              <div>
                <!-- Label + botão "Ver detalhes" na mesma linha, acima do select -->
                <div class="flex items-center justify-between mb-1">
                  <label class="text-sm" style="color: var(--text-muted);">
                    Classe <span class="text-red-500">*</span>
                  </label>
                  <button v-if="selectedClass" type="button" @click="showClassModal = true"
                    class="px-2 text-xs transition-colors" style="color: #f59e0b;">
                    Ver detalhes →
                  </button>
                </div>
                <select v-model="form.classId" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
             text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  :class="{ 'border-red-700': submitAttempted && !form.classId }">
                  <option :value="0" disabled>Selecione uma classe</option>
                  <option v-for="c in classes" :key="c.id" :value="c.id">
                    {{ c.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Level -->
            <div>
              <label class="block text-sm text-slate-400 mb-1">Grau de Força (Inicia com 0)</label>
              <input v-model.number="form.level" type="number" min="0" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                         text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors" />
            </div>


            <div>
              <label class="block text-sm text-slate-400 mb-1">Idade</label>
              <input v-model.number="form.age" type="number" min="0" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                         text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div>
              <label class="block text-sm text-slate-400 mb-1">Personalidade</label>
              <input v-model="form.personality" type="text" placeholder="Ex: Corajoso, Sarcástico" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                         text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors" />
            </div>



            <!-- Occupation -->
            <div>
              <label class="block text-sm text-slate-400 mb-1">Ocupação</label>
              <input v-model="form.occupation" type="text" placeholder="Ex: Mercenário, Estudante de magia" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                       text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors" />
            </div>

            <!-- Coins -->
            <div>
              <label class="block text-sm text-slate-400 mb-1">Moedas (Luminar)</label>
              <input v-model.number="form.coins" type="number" min="0" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                       text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors" />
            </div>

            <!-- Height and Weight -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-slate-400 mb-1">Altura (m)</label>
                <input v-model.number="form.height" type="number" step="0.01" min="0" placeholder="Ex: 1.75" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                          text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors" />
              </div>

              <div>
                <label class="block text-sm text-slate-400 mb-1">Peso (kg)</label>
                <input v-model.number="form.weight" type="number" step="0.1" min="0" placeholder="Ex: 70.5" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                          text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors" />
              </div>
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

          </div>

          <!-- Tab 3: Status -->
          <div v-else-if="activeTab === 'status'" class="space-y-4">

            <div class="grid grid-cols-1 smgrid-cols-2 gap-4">
              <NumberField label="Pontos de Vida" v-model="form.vitality" />

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-sm text-slate-400">Pontos de Centelha</label>
                  <span class="text-xs text-amber-400/70">{{ sparkFormulaLabel }}</span>
                </div>
                <input v-model.number="form.spark" type="number" min="0" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5
                        text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors" />
              </div>

              <NumberField label="Pontos de Brasa" v-model="form.embers" />
              <NumberField label="Iniciativa" v-model="form.initiative" />
              <NumberField label="Movimento" v-model="form.movement" />
              <NumberField label="Alma" v-model="form.soul" />
            </div>


          </div>

          <!-- Tab 4: Proficiencies -->
          <div v-else-if="activeTab === 'proficiencies'" class="space-y-6">
            <p class="text-xs text-slate-500">
              Distribua os pontos conforme a ficha. Máximo recomendado: 18 por perícia.
            </p>

            <div v-for="group in groupedProficiencies" :key="group.category">
              <h3 class="text-xs flex gap-2 align-center uppercase tracking-wider mb-3 text-amber-500 font-bold ">
                {{ group.label }}
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="prof in group.items" :key="prof.id" class="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style="background-color: var(--bg-input); border: 1px solid var(--border);">
                  <span class="flex-1 text-sm text-slate-300 truncate">{{ prof.name }}</span>
                  <input :value="proficiencyValues[prof.id] ?? 0"
                    @input="proficiencyValues[prof.id] = Number(($event.target as HTMLInputElement).value)"
                    type="number" min="0" max="18" class="w-16 bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5
                          text-slate-100 text-sm text-center focus:outline-none
                          focus:border-amber-500 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 5: Skills -->
          <div v-else-if="activeTab === 'skills'" class="space-y-3">
            <p class="text-xs text-slate-500">
              Suas habilidades ativas exclusivas. Elas aparecem na ficha junto às habilidades da classe.
            </p>

            <div v-if="skills.length === 0"
              class="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-700 rounded-lg">
              Nenhuma habilidade criada ainda.
            </div>

            <div v-for="skill in skills" :key="skill.tempId"
              class="flex items-center justify-between gap-3 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg">
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-100 truncate">{{ skill.name }}</p>
                <p class="text-xs text-slate-500 truncate">{{ skill.description }}</p>
              </div>
              <div class="flex gap-2 shrink-0">
                <button @click="openEditSkill(skill)" type="button" class="text-xs text-amber-500 hover:text-amber-400">
                  Editar
                </button>
                <button @click="handleRemoveSkill(skill)" type="button" class="text-xs text-red-400 hover:text-red-300">
                  Remover
                </button>
              </div>
            </div>

            <button @click="openNewSkill" type="button" class="w-full py-2.5 text-sm border border-dashed border-slate-600
           text-slate-400 hover:text-slate-100 hover:border-slate-400 rounded-lg transition-colors">
              + Criar nova habilidade
            </button>
          </div>

          <!-- Tab 6: History -->
          <div v-else-if="activeTab === 'history'" class="space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-xs" style="color: var(--text-faint);">
                Use Markdown para formatar: # Título, ## Subtítulo, **negrito**, *itálico*
              </p>
              <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" class="text-xs"
                style="color: #f59e0b;">
                Guia →
              </a>
            </div>

            <textarea v-model="form.history" rows="16" placeholder="Escreva a história do personagem aqui...

# Origem
Nascido em uma pequena vila...
            
## Motivação
Sua busca pela verdade..." class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3
text-slate-100 text-sm focus:outline-none focus:border-amber-500
transition-colors resize-none font-mono leading-relaxed" />
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
          <RouterLink to="/characters" class="flex-1 text-center py-2.5 text-sm border border-slate-600 text-slate-400
                   hover:text-slate-100 hover:border-slate-400 rounded-lg transition-colors">
            Cancelar
          </RouterLink>
          <button @click="handleSubmit" :disabled="submitting" class="flex-1 py-2.5 text-sm bg-amber-600 hover:bg-amber-500 disabled:opacity-50
                   text-white font-medium rounded-lg transition-colors">
            {{ submitting ? 'Salvando...' : (isEditing ? 'Salvar alterações' : 'Criar personagem') }}
          </button>
        </div>
      </template>

      <ClassDetailModal v-if="showClassModal && selectedClass" :rpg-class="selectedClass"
        @close="showClassModal = false" />

      <SkillModal
        v-if="showSkillModal"
        :editing-skill="editingSkill"
        @save="handleSaveSkill"
        @close="showSkillModal = false"
      />

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import NumberField from '@/components/ui/NumberField.vue'
import ClassDetailModal from '@/components/character/ClassDetailModal.vue'
import { charactersApi } from '@/api/characters.api'
import { classesApi } from '@/api/classes.api'
import type { RPGClass, SkillDraft } from '@/types/character.types'
import { useToast } from '@/composables/useToast'
import { proficienciesApi } from '@/api/proficiencies.api'
import type { Proficiency, ProficiencyCategory } from '@/types/character.types'
import NavTabs from '@/components/character/NavTabs.vue'
import { usePhotoUpload } from '@/composables/usePhotoUpload'
import SkillModal from '@/components/character/SkillModal.vue'

const toast = useToast()
const photoUpload = usePhotoUpload()

const route = useRoute()
const router = useRouter()

const showClassModal = ref(false)

const selectedClass = computed(() =>
  classes.value.find(c => c.id === form.value.classId) ?? null
)

// ── View mode ──────────────────────────────────────────
const characterId = route.params.id ? Number(route.params.id) : null
const isEditing = computed(() => characterId !== null)

// ── State ───────────────────────────────────────────────
const initialLoading = ref(false)
const submitting = ref(false)
const submitAttempted = ref(false)
const errorMessage = ref('')
const classes = ref<RPGClass[]>([])
const existingPhotoUrl = ref<string | null>(null)

const navTabsRef = ref<InstanceType<typeof NavTabs> | null>(null)

const activeTab = computed(() => navTabsRef.value?.activeTab)

// ── Form — unique state and flat ─────────────────────
const form = ref({
  // Dados gerais
  name: '',
  race: '',
  classId: 0,
  level: 0,
  age: 0,
  personality: '',
  occupation: '',
  height: 0,
  weight: 0,
  coins: 0,
  // Atributos
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  education: 10,
  presence: 10,
  power: 10,
  // Status
  vitality: 20,
  spark: 1,
  embers: 1,
  soul: 0,
  initiative: 0,
  movement: 1,
  history: '',
})

// ── Skills ─────────────────────────────────────────────
const skills = ref<SkillDraft[]>([])
const removedSkillIds = ref<number[]>([])
const editingSkill = ref<SkillDraft | null>(null)
const showSkillModal = ref(false)

function openNewSkill() {
  editingSkill.value = null
  showSkillModal.value = true
}

function openEditSkill(skill: SkillDraft) {
  editingSkill.value = skill
  showSkillModal.value = true
}

function handleSaveSkill(skillData: Omit<SkillDraft, 'tempId'>) {
  if (editingSkill.value) {
    const target = skills.value.find(s => s.tempId === editingSkill.value!.tempId)
    if (target) Object.assign(target, skillData)
  } else {
    skills.value.push({ ...skillData, tempId: crypto.randomUUID() })
  }
  showSkillModal.value = false
}

function handleRemoveSkill(skill: SkillDraft) {
  if (skill.id) removedSkillIds.value.push(skill.id)
  skills.value = skills.value.filter(s => s.tempId !== skill.tempId)
}

async function persistSkills(targetCharacterId: number) {
  const created = skills.value.filter(s => !s.id)
  const updated = skills.value.filter(s => s.id)

  await Promise.all([
    ...created.map(s => charactersApi.createSkill(targetCharacterId, toSkillPayload(s))),
    ...updated.map(s => charactersApi.updateSkill(targetCharacterId, s.id!, toSkillPayload(s))),
    ...removedSkillIds.value.map(id => charactersApi.deleteSkill(targetCharacterId, id)),
  ])
}

function toSkillPayload(skill: SkillDraft) {
  return {
    name: skill.name,
    description: skill.description,
    sparkCost: skill.sparkCost,
    emberCost: skill.emberCost,
    upgradeDescription: skill.upgradeDescription,
  }
}

// ── Proficiencies ──────────────────────────────────────────

const allProficiencies = ref<Proficiency[]>([])
const proficiencyValues = ref<Record<number, number>>({})  // { proficiencyId: value }

const groupedProficiencies = computed(() => {
  const order: ProficiencyCategory[] = [
    'COMBATE', 'SOBRENATURAL', 'INVESTIGACAO', 'SOCIAL', 'PRATICA', 'ESPECIAL'
  ]
  return order.map(category => ({
    category,
    label: categoryLabel(category),
    items: allProficiencies.value.filter(p => p.category === category)
  })).filter(group => group.items.length > 0)
})

function categoryLabel(category: string) {
  const labels: Record<string, string> = {
    COMBATE: 'Combate',
    SOBRENATURAL: 'Sobrenatural',
    INVESTIGACAO: 'Investigação',
    SOCIAL: 'Social',
    PRATICA: 'Prática',
    ESPECIAL: 'Especial'
  }
  return labels[category] ?? category
}

// ── Validation ─────────────────────────────────────────────
const hasGeneralErrors = computed(() =>
  !form.value.name || !form.value.race || !form.value.classId
)

const sparkFormulaLabel = computed(() => {
  if (!selectedClass.value) return ''

  const formulas: Record<string, string> = {
    ASHEN: 'FOR + POD ÷ 2',
    SHARD: 'DES + POD ÷ 2',
    LUMEN: 'INT + POD ÷ 2'
  }

  return formulas[selectedClass.value.archetype] ?? ''
})

// ── Initialize ─────────────────────────────────────────
onMounted(async () => {
  try {
    const { data } = await classesApi.getAll()
    classes.value = data

    const { data: profData } = await proficienciesApi.getAll()
    allProficiencies.value = profData

    profData.forEach(prof => {
      proficiencyValues.value[prof.id] = 0
    })
  } catch {
    errorMessage.value = 'Erro ao carregar classes.'
  }

  if (isEditing.value && characterId) {
    initialLoading.value = true
    try {
      const { data } = await charactersApi.getById(characterId)

      form.value.name = data.name
      form.value.race = data.race
      form.value.classId = data.classId
      form.value.level = data.level
      form.value.age = data.age ?? 0
      form.value.personality = data.personality ?? ''
      form.value.occupation = data.occupation ?? ''
      form.value.coins = data.coins ?? 0
      form.value.height = data.height ?? 0
      form.value.weight = data.weight ?? 0
      existingPhotoUrl.value = data.photoUrl ?? null

      // Attributes
      if (data.attributes) {
        form.value.strength = data.attributes.strength
        form.value.dexterity = data.attributes.dexterity
        form.value.constitution = data.attributes.constitution
        form.value.intelligence = data.attributes.intelligence
        form.value.education = data.attributes.education
        form.value.presence = data.attributes.presence
        form.value.power = data.attributes.power
      }

      // Status
      if (data.status) {
        form.value.vitality = data.status.vitality
        form.value.spark = data.status.spark
        form.value.embers = data.status.embers
        form.value.soul = data.status.soul
        form.value.initiative = data.status.initiative
        form.value.movement = data.status.movement
      }

      // Proficiencies
      if (data.proficiencies) {
        data.proficiencies.forEach((prof => {
          proficiencyValues.value[prof.proficiencyId] = prof.value
        }))
      }

      // History
      form.value.history = data.history ?? ''

      if (data.skills && data.skills.length > 0) {
        skills.value = data.skills.map(skill => ({
          tempId: crypto.randomUUID(),
          id: skill.id,
          name: skill.name,
          description: skill.description,
          sparkCost: skill.sparkCost ?? 0,
          emberCost: skill.emberCost ?? 0,
          upgradeDescription: skill.upgradeDescription ?? '',
        }))
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

  if (navTabsRef.value) {
    navTabsRef.value.activeTab = 'general'
  }

  submitting.value = true
  try {
    const payload = {
      ...form.value,
      personality: form.value.personality || undefined,
      occupation: form.value.occupation || undefined,
      history: form.value.history || undefined,
      proficiencies: Object.entries(proficiencyValues.value).map(([id, value]) => ({
        proficiencyId: Number(id),
        value
      }))
    }

    if (isEditing.value && characterId) {
      await charactersApi.update(characterId, payload)
      await persistSkills(characterId)
      if (photoUpload.previewUrl.value) await photoUpload.upload(characterId)

      if (photoUpload.previewUrl.value) {
        await photoUpload.upload(characterId)
      }

      router.push(`/characters/${characterId}`)
      toast.success('Personagem atualizado com sucesso!')
    } else {
      const { data } = await charactersApi.create(payload)
      await persistSkills(data.id)
      if (photoUpload.previewUrl.value) await photoUpload.upload(data.id)

      if (photoUpload.previewUrl.value) {
        await photoUpload.upload(data.id)
      }

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