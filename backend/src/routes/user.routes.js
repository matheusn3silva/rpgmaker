// src/routes/user.router.js
const authMiddleware = require('../middlewares/auth.middleware')
const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const bcrypt = require('bcrypt')

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
  } catch (err) {
    console.error('Prisma error in GET /user/me:', err)
    return res.status(500).json({ message: 'Erro interno' })
  }
})

// PUT /user/name — atualiza o nome do usuário
router.put('/name', authMiddleware, async (req, res) => {
  const userId = req.user.id
  const { name } = req.body

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Nome inválido '})
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() }
    })
    return res.json({ message: 'Nome atualizado com sucesso' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro no servidor.' })
  }
})

// PUT /user/password — atualiza a senha do usuário
router.put('/password', authMiddleware, async (req, res) => {
  const userId = req.user.id
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Dados inválidos' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'A nova senha deve ter no mínimo 6 caracteres' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Senha atual incorreta' })
    }

    const hash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hash }
    })

    return res.json({ message: 'Senha alterada com sucesso' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro interno' })
  }
})

module.exports = router
