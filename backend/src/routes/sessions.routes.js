const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const authMiddleware = require('../middlewares/auth.middleware')
const { generateCode } = require('../lib/sessionCode')

async function generateUniqueCode() {
    let code
    let exists = true

    while (exists) {
        code = generateCode()
        const found = await prisma.session.findUnique({ where: { code }})
        exists = !!found
    }

    return code
}

router.post('/', authMiddleware, async (req, res) => {
    const userId = req.user.id

    try {
        const code = await generateUniqueCode()

        const session = await prisma.session.create({
        data: {
            code,
            masterId: userId,
        }})

        return res.status(201).json({ id: session.id, code: session.code })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro ao criar sessão' })
    }
})

module.exports = router