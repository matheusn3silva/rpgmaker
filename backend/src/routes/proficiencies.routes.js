const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const authMiddleware = require('../middlewares/auth.middleware')

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

module.exports = router