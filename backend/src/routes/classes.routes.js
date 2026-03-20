const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const authMiddleware = require('../middlewares/auth.middleware')

/**
 * LISTAR CLASSES
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const classes = await prisma.RPGClass.findMany()
    return res.json(classes)
  } catch (error) {
    console.error('Erro ao buscar classes:', error)
    return res.status(500).json({ message: 'Erro ao buscar as classes' })
  }
})

/**
 * BUSCAR CLASSE + SKILLS
 */
router.get('/:id', authMiddleware, async (req, res) => {
  const classId = Number(req.params.id)

  try {
    const classData = await prisma.RPGClass.findUnique({
      where : { id: classId },
      include: {
        skills: true
      }
    })

    return res.json(classData)
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor ' })
  }
})

module.exports = router