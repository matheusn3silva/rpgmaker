const express = require('express')

const authRoutes = require('./auth.routes')
const characterRoutes = require('./characters.routes')
const classesRoutes = require('./classes.routes')
const userRoutes = require('./user.routes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/characters', characterRoutes)
router.use('/classes', classesRoutes)
router.use('/user', userRoutes)

module.exports = router
