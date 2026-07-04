const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const authMiddleware = require('../middlewares/auth.middleware')

function buildCharacterData(body) {
  const { name, age, personality, birthDate, birthPlace, residence, occupation, race, level, experience, classId, history, coins, height, weight } = body

  return { 
    name: name.trim(),
    age: age,
    personality: personality?.trim(),
    birthDate: birthDate ? new Date(birthDate) : undefined,
    birthPlace: birthPlace?.trim(),
    residence: residence?.trim(),
    occupation: occupation?.trim(),
    race: race.trim(),
    
    level,
    experience,
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
  const { vitality, spark, embers, soul, initiative, luck, movement, energyType } = body

  return { 
    vitality:       vitality      ?? 20, 
    spark:          spark         ?? 1, 
    embers:         embers        ?? 1, 
    soul:           soul          ?? 0, 
    initiative:     initiative    ?? 0, 
    luck:           luck          ?? 0, 
    movement:       movement      ?? 1, 
    energyType:     energyType    ?? null
  }
}



/**
 * Criar personagem
 */
/**
 * @swagger
 * /characters:
 *   post:
 *     tags: [Personagens]
 *     summary: Cria um novo personagem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, race, classId]
 *             properties:
 *               name:        { type: string,  example: Aragorn }
 *               race:        { type: string,  example: Humano }
 *               classId:     { type: integer, example: 1 }
 *               level:       { type: integer, example: 1 }
 *               experience:  { type: integer, example: 0 }
 *               age:         { type: integer, example: 25 }
 *               personality: { type: string,  example: Corajoso }
 *               history:     { type: string,  example: '# Origem\nNasceu em...' }
 *               strength:    { type: integer, example: 15 }
 *               dexterity:   { type: integer, example: 12 }
 *               lifePoints:  { type: integer, example: 20 }
 *     responses:
 *       201:
 *         description: Personagem criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer, example: 1 }
 *       400:
 *         description: Campos obrigatórios ausentes
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
/**
 * @swagger
 * /characters/{id}:
 *   get:
 *     tags: [Personagens]
 *     summary: Busca um personagem completo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Personagem com atributos e status
 *       404:
 *         description: Personagem não encontrado
 *   put:
 *     tags: [Personagens]
 *     summary: Atualiza um personagem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Personagem atualizado
 *       404:
 *         description: Personagem não encontrado
 *   delete:
 *     tags: [Personagens]
 *     summary: Remove um personagem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Personagem removido
 *       404:
 *         description: Personagem não encontrado
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
/**
 * @swagger
 * /characters:
 *   get:
 *     tags: [Personagens]
 *     summary: Lista personagens do usuário logado
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Página atual
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 5 }
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista paginada de personagens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Character' }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *       401:
 *         description: Não autenticado
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


/**
 * BUSCAR PERSONAGEM PARA EDITAR
 */
/**
 * @swagger
 * /characters/{id}:
 *   get:
 *     tags: [Personagens]
 *     summary: Busca um personagem completo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Personagem com atributos e status
 *       404:
 *         description: Personagem não encontrado
 *   put:
 *     tags: [Personagens]
 *     summary: Atualiza um personagem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Personagem atualizado
 *       404:
 *         description: Personagem não encontrado
 *   delete:
 *     tags: [Personagens]
 *     summary: Remove um personagem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Personagem removido
 *       404:
 *         description: Personagem não encontrado
 */
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


/**
 * DELETAR PERSONAGEM
 */
/**
 * @swagger
 * /characters/{id}:
 *   get:
 *     tags: [Personagens]
 *     summary: Busca um personagem completo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Personagem com atributos e status
 *       404:
 *         description: Personagem não encontrado
 *   put:
 *     tags: [Personagens]
 *     summary: Atualiza um personagem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Personagem atualizado
 *       404:
 *         description: Personagem não encontrado
 *   delete:
 *     tags: [Personagens]
 *     summary: Remove um personagem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Personagem removido
 *       404:
 *         description: Personagem não encontrado
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

/**
 * POST /characters/:characterId/skills
 * Cria a habilidade ativa do personagem
 */
router.post('/:characterId/skills', authMiddleware, async (req, res) => {
    const characterId = Number(req.params.characterId)
    const userId = req.user.id

    if (!(await verifyOwnership(characterId, userId, res))) return

    const {
        name, description, sparkCost, emberCost,
        upgradeDescription, upgradeCost, upgradeType
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
                upgradeDescription: upgradeDescription?.trim() || null,
                upgradeCost: upgradeCost ?? 0,
                upgradeType: upgradeType?.trim() || null
            }
        })
        res.status(201).json(skill)
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar habilidade' })
    }
})

/**
 * PUT /characters/:characterId/skills/:skillId
 * Atualiza a habilidade ativa do personagem
 */
router.put('/:skillId', authMiddleware, async (req, res) => {
    const characterId = Number(req.params.characterId)
    const skillId = Number(req.params.skillId)
    const userId = req.user.id

    if (!(await verifyOwnership(characterId, userId, res))) return

    const {
        name, description, sparkCost, emberCost,
        upgradeDescription, upgradeCost, upgradeType
    } = req.body

    try {
        const skill = await prisma.characterSkill.update({
            where: { id: skillId },
            data: {
                name: name?.trim(),
                description: description?.trim(),
                sparkCost: sparkCost ?? 0,
                emberCost: emberCost ?? 0,
                upgradeDescription: upgradeDescription?.trim() || null,
                upgradeCost: upgradeCost ?? 0,
                upgradeType: upgradeType?.trim() || null
            }
        })
        return res.json(skill)
    } catch {
        return res.status(500).json({ message: 'Erro ao atualizar habilidade' })
    }
})

/**
 * DELETE /characters/:characterId/skills/:skillId
 * Remove a habilidade ativa do personagem
 */
router.delete('/:skillId', authMiddleware, async (req, res) => {
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

module.exports = router
