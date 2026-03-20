const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const routes = require('./routes/routes')

const app = express()

app.use([
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  }),
  express.json(),
  cookieParser(),
  passport.initialize()
])

app.use(routes)

module.exports = app
