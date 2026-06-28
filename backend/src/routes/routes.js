const express = require('express')

const authRoutes = require('./auth.routes')
const characterRoutes = require('./characters.routes')
const characterSkillsRoutes = require('./characterSkills.routes')
const classesRoutes = require('./classes.routes')
const userRoutes = require('./user.routes')
const proficienciesRoutes = require('./proficiencies.routes')


const router = express.Router()

router.use('/auth', authRoutes)
router.use('/characters', characterRoutes)
router.use('/characters/:characterId/skills', characterSkillsRoutes)
router.use('/classes', classesRoutes)
router.use('/user', userRoutes)
router.use('/proficiencies', proficienciesRoutes)


module.exports = router
