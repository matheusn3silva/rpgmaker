const express = require('express')
const router = express.Router({ mergeParams: true })

const prisma = require('../lib/prisma')
const authMiddleware = require('../middlewares/auth.middleware')

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
