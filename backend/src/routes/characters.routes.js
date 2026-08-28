const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('../middlewares/upload.middleware')
const supabase = require('../lib/supabase')

function buildCharacterData(body) {
  const { name, age, personality, occupation, race, level, classId, history, coins, height, weight } = body

  return { 
    name: name.trim(),
    age: age,
    personality: personality?.trim(),
    occupation: occupation?.trim(),
    race: race.trim(),
    
    level,
    classId,
    history: history?.trim() || null,
    coins: coins || 0,
    height: height || 0,
    weight: weight || 0
   }
}

function buildAttributesData(body) {
  const { strength, dexterity, constitution, intelligence, education, presence, power } = body

  return { strength, dexterity, constitution, intelligence, education, presence, power }
}

function buildStatusData(body) {
  const { vitality, spark, embers, soul, initiative, movement } = body

  return { 
    vitality:       vitality      ?? 20, 
    spark:          spark         ?? 1, 
    embers:         embers        ?? 1, 
    soul:           soul          ?? 0, 
    initiative:     initiative    ?? 0, 
    movement:       movement      ?? 1, 
  }
}

/* ======================= CREATE CHARACTER ======================= */
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id
  const { name, race, classId, proficiencies } = req.body

  if (!name || !race || !classId) {
    return res.status(400).json({
      message: 'Nome, raça e classe são obrigatórios'
    })
  }

  try {

    const character = await prisma.character.create({
      data: {
        userId: userId,
        ...buildCharacterData(req.body),
               
        attributes: {
          create: buildAttributesData(req.body)
        },

        status: {
          create: buildStatusData(req.body)
        }
      }
    })

    if (proficiencies && Array.isArray(proficiencies)) {

      await Promise.all(
        proficiencies.map(p => 
          prisma.characterProficiency.create({
            data: {
              characterId: character.id,
              proficiencyId: p.proficiencyId,
              value: p.value
            }
          })
        )
      )
    }

    return res.status(201).json({ id: character.id })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao criar personagem' })
  } 
})

/* ======================= UPDATE CHARACTER ======================= */
router.put('/:id', authMiddleware, async (req, res) => {
  const userId = req.user.id
  const characterId = Number(req.params.id)
  const { name, race, classId } = req.body

  if (isNaN(characterId)) {
    return res.status(400).json({ message: 'ID inválido' })
  }

  if (!name || !race || !classId) {
    return res.status(400).json({
      message: 'Nome, raça e classe são obrigatórios'
    })
  }

  try {
    const existing = await prisma.character.findFirst({
      where: { id: characterId, userId: userId }
    })

    const { proficiencies } = req.body

    if (!existing) {
      return res.status(404).json({ message: 'Personagem não encontrado' })
    }

    await prisma.character.update({
      where: { id: characterId },
      data: {
        ...buildCharacterData(req.body),
               
        attributes: {
          upsert: {
            create: buildAttributesData(req.body),
            update: buildAttributesData(req.body)
          }
        },

        status: {
          upsert: {
            create: buildStatusData(req.body),
            update: buildStatusData(req.body)
          }
        }
      }
    })

    if (proficiencies && Array.isArray(proficiencies)) {
      await Promise.all(
        proficiencies.map(p => 
          prisma.characterProficiency.upsert({
            where: {
              characterId_proficiencyId: {
                characterId,
                proficiencyId: p.proficiencyId
              }
            },
            update: { value: p.value },
            create: {
              characterId,
              proficiencyId: p.proficiencyId,
              value: p.value
            }
          })
        )
      )
    }

    return res.json({ message: 'Personagem atualizado' })
  } catch {
      return res.status(500).json({ message: 'Erro ao atualizar personagem' })
  }
})


/* ======================= LIST CHARACTERS ======================= */
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 5
  const skip = (page - 1) * limit

  try {
    const [total, characters] = await Promise.all([
      prisma.character.count({
        where: { userId }
      }),

      prisma.character.findMany({
        where: { userId },
        include: {
          class: {
            select: {
              name: true,
              archetype: true
            }
          }
        },
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      })
    ])

    const totalPages = Math.ceil(total / limit)

    const data = characters.map((c) => ({
      id: c.id,
      name: c.name,
      race: c.race,
      level: c.level,
      classId: c.classId,
      class_name: c.class.name,
      archetype: c.class.archetype,
      createdAt: c.createdAt,
      history: c.history
    }))

    return res.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao listar personagens' })
  }

})


/* ======================= GET CHARACTER FOR EDIT ======================= */
router.get('/:id', authMiddleware, async (req, res) => {
  const characterId = Number(req.params.id)
  const userId = req.user.id  

  if (isNaN(characterId)) {
    return res.status(400).json({ message: 'ID Inválido' })
  }

  try {
    const character = await prisma.character.findFirst({
      where: { id: characterId, userId: userId },
      include: {
        attributes: true,
        status: true,
        skills: true,
        proficiencies: {
          include: {
            proficiency: true
          }
        },
        class: {
          select: {
            name: true,
            archetype: true,
            sparkFormula: true,
          }
        }
      }
    })

    if (!character) {
      return res.status(404).json({ message: 'Personagem não encontrado' })
    }

    return res.json({ ...character, class_name: character.class.name, archetype: character.class.archetype, sparkFormula: character.class.sparkFormula })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro no servidor' })
  }
})


/* ======================= DELETE CHARACTER ======================= */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const characterId = Number(req.params.id)
    const userId = req.user.id

    if (isNaN(characterId)) {
      return res.status(400).json({ message: 'ID inválido' })
    }

    await prisma.character.delete({
      where: { 
        id: characterId, 
        userId: userId
      }
    })

    return res.json({ message: 'Personagem deletado com sucesso' })
  } catch (error) {
    
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Personagem não encontrado'})
    }

    return res.status(500).json({ message: 'Erro ao deletar personagem' })
  }
})



async function verifyOwnership(characterId, userId, res) {
    const character = await prisma.character.findFirst({
        where: { id: characterId, userId: userId }
    })

    if (!character) {
        res.status(404).json({ message: 'Personagem não encontrado' })
        return false
    }

    return true
}

/* ======================= CREATE CHARACTER ACTIVE SKILL ======================= */
router.post('/:characterId/skills', authMiddleware, async (req, res) => {
    const characterId = Number(req.params.characterId)
    const userId = req.user.id

    if (!(await verifyOwnership(characterId, userId, res))) return

    const {
        name, description, sparkCost, emberCost,
        upgradeDescription
    } = req.body

    if (!name || !description) {
        return res.status(400).json({ message: 'Nome e descrição são obrigatórios' })
    }

    try {
        const skill = await prisma.characterSkill.create({
            data: {
                characterId,
                name: name.trim(),
                type: 'ATIVA_ACAO',
                description: description.trim(),
                sparkCost: sparkCost ?? 0,
                emberCost: emberCost ?? 0,
                upgradeDescription: upgradeDescription?.trim() || null
            }
        })
        res.status(201).json(skill)
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar habilidade' })
    }
})

/* ======================= UPDATE CHARACTER ACTIVE SKILL ======================= */
router.put('/:characterId/skills/:skillId', authMiddleware, async (req, res) => {
    const characterId = Number(req.params.characterId)
    const skillId = Number(req.params.skillId)
    const userId = req.user.id

    if (!(await verifyOwnership(characterId, userId, res))) return

    const {
        name, description, sparkCost, emberCost,
        upgradeDescription
    } = req.body

    try {
        const skill = await prisma.characterSkill.update({
            where: { id: skillId },
            data: {
                name: name?.trim(),
                description: description?.trim(),
                sparkCost: sparkCost ?? 0,
                upgradeDescription: upgradeDescription?.trim() || null,
                emberCost: emberCost ?? 0
            }
        })
        return res.json(skill)
    } catch {
        return res.status(500).json({ message: 'Erro ao atualizar habilidade' })
    }
})

/* ======================= REMOVE CHARACTER ACTIVE SKILL ======================= */
router.delete('/:characterId/skills/:skillId', authMiddleware, async (req, res) => {
    const characterId = Number(req.params.characterId)
    const skillId = Number(req.params.skillId)
    const userId = req.user.id

    if (!(await verifyOwnership(characterId, userId, res))) return

    try {
        await prisma.characterSkill.delete({
            where: { id: skillId }
        })
        return res.json({ message: 'Habilidade removida' })
    } catch {
        return res.status(500).json({ message: 'Erro ao remover habilidade' })
    }
})

/* ======================= PROFICIENCIES ======================= */
router.get('/', authMiddleware, async (req,res) => {
    try {
        const proficiencies = await prisma.Proficiency.findMany({
            orderBy: [
                { category: 'asc' },
                { name: 'asc' }

            ]
        })
        res.json(proficiencies)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao buscar as proficiências' })
    }
})

/* ======================= UPLOAD CHARACTER PHOTO ======================= */
router.post('/:id/photo', authMiddleware, upload.single('photo'), async (req, res) => {
  const characterId = Number(req.params.id)
  const userId = req.user.id

  if (isNaN(characterId)) {
    return res.status(400).json({ message: 'ID inválido' })
  }

  if (!(await verifyOwnership(characterId, userId, res))) return

  if (!req.file) {
    return res.status(400).json({ message: 'Nenhuma imagem enviada' })
  }

  try {
    const fileExt = req.file.mimetype.split('/')[1]
    const filePath = `characters/${userId}/${characterId}/photo.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('rpg-assets')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('rpg-assets')
        .getPublicUrl(filePath)

      const character = await prisma.character.update({
        where: { id: characterId },
        data: { photoUrl: publicUrlData.publicUrl }
      })

      return res.json({ photoUrl: character.photoUrl })
  } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao enviar foto' })
  }
})

module.exports = router
