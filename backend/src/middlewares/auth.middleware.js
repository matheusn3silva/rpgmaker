const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
      id: decoded.id,
      email: decoded.email
    }

    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }
}

module.exports = authMiddleware
