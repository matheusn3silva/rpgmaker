// src/routes/user.router.js
const authMiddleware = require('../middlewares/auth.middleware')
const express = require('express')
const router = express.Router()

const prisma = require('../lib/prisma')

// GET /user/me  — retorna dados do usuário autenticado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'Não autenticado' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        verified: true
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    return res.json(user)
  } catch (error) {
    console.error('Prisma error in GET /user/me:', err)
    return res.status(500).json({ message: 'Erro interno' })
  }
})

module.exports = router
