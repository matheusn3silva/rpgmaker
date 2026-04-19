const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const authMiddleware = require('../middlewares/auth.middleware')

function buildCharacterData(body) {
  const { name, age, personality, birthDate, birthPlace, residence, occupation, race, level, experience, classId, history } = body

  return { 
    name: name.trim(),
    age: age,
    personality: personality?.trim(),
    birthDate: birthDate ? new Date(birthDate) : undefined,
    birthPlace: birthPlace?.trim(),
    residence: residence?.trim(),
    occupation: occupation?.trim(),
    race: race.trim(),
    
    level: level,
    experience: experience,
    classId: classId,
    history: history?.trim() || null
   }
}

function buildAttributesData(body) {
  const { strength, dexterity, constitution, intelligence, education, presence, power, size } = body

  return { strength, dexterity, constitution, intelligence, education, presence, power, size }
}

function buildStatusData(body) {
  const { lifePoints, effortPoints, energyPoints, exposureLevel, initiative, luck, movement, typeEnergy } = body

  return { lifePoints, effortPoints, energyPoints, exposureLevel, initiative, luck, movement, typeEnergy }
}

/**
 * Criar personagem
 */
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id
  const { name, race, classId } = req.body

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

    return res.status(201).json({ id: character.id })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao criar personagem' })
  } 
})

/**
 * ENVIAR OS NOVOS DADOS DO PERSONAGEM EDITADO
 */
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

    return res.json({ message: 'Personagem atualizado' })
  } catch {
      return res.status(500).json({ message: 'Erro ao atualizar personagem' })
  }
})


/**
 * LISTAR PERSONAGENS DO USUÁRIO LOGADO
 */
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
              name: true
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
      createdAt: c.createdAt
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


/**
 * BUSCAR PERSONAGEM PARA EDITAR
 */
router.get('/:id', authMiddleware, async (req, res) => {
  const characterId = Number(req.params.id)
  const userId = req.user.id  

  if (isNaN(characterId)) {
    return res.status(400).json({ message: 'ID Inválido' })
  }

  try {
    const character = await prisma.character.findFirst({
      where: { 
        id: characterId,
        userId: userId 
      },
      include: {
        attributes: true,
        status: true,
        class: {
          select: {
            name: true
          }
        }
      }
    })

    if (!character) {
      return res.status(404).json({ message: 'Personagem não encontrado' })
    }

    return res.json({ ...character, class_name: character.class.name })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro no servidor' })
  }
})


/**
 * DELETAR PERSONAGEM
 */
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


module.exports = router
