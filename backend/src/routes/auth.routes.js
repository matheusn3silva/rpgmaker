const authMiddleware = require('../middlewares/auth.middleware')
const express = require('express')
const router = express.Router()

const passport = require('passport')
require('../auth/google.strategy')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

const SECRET = process.env.JWT_SECRET

/**
 * VERIFICA SE O USUÁRIO ESTÁ LOGADO
 */
router.get('/me', authMiddleware, async (req, res) => {
  const userId = req.user.id
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true
    }
  })

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  res.json(user)
})

// Inicia autenticação com Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// Callback do Google
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    })

    // redireciona para frontend sem token em query
    res.redirect('http://localhost:5173/characters')
  }
)

/**
 * CADASTRO
 */
const crypto = require('crypto')
const sendMail = require('../services/mail')

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

   if (!name || !email || !password) {
    return res.status(400).json({ message: 'Dados inválidos' })
  }


  const hashedPassword = bcrypt.hashSync(password, 10)
  const verificationToken = crypto.randomBytes(32).toString('hex')

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verified: false,
        verificationToken
      }
    })
  } catch (err) {
    return res.status(400).json({ message: err})
  }

  try {
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`

    await sendMail({
      to: email,
      subject: 'Confirme seu email - RPG Maker',
      html: `
        <p>Olá ${name},</p>
        <p>Clique no link abaixo para verificar seu email:</p>
        <p><a href="${link}">Confirmar email</a></p>
        <p>Se não foi você, ignore esta mensagem.</p>
      `,
      text: `Confirme seu email: ${link}`
    })
  } catch (mailErr) {
    console.error('Erro ao enviar email:', mailErr)
  }

  return res.status(201).json({
    message: 'Cadastro realizado. Verifique seu email.'
  })
})


router.post('/resend-verification', async (req, res) => {
  const { email } = req.body
  if (!email) return res.json({ message: 'Se o email existir, enviaremos a confirmação.' })

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.json({ message: 'Se o email existir, enviaremos a confirmação.' })
  }

  // EMAIL JÁ VERIFICADO
  if (user.verified) {
    return res.json({ message: 'Email já verificado.' })
  }

  let token = user.verificationToken

  if (!token) {
    token = crypto.randomBytes(32).toString('hex')

    await prisma.user.update({
       where: { id: user.id },
       data: { verificationToken: token }
    })
  }

  // TENTA ENVIAR O EMAUL DEPOIS DAS VALIDAÇÕES
  try {
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
    await sendMail({
      to: email,
      subject: 'Reenvio: Confirme seu email - RPG Maker',
      html: `<p>Clique: <a href="${link}">Confirmar email</a></p>`,
      text: `Confirmar email: ${link}`
    })
  } catch (mailErr) {
    console.error('Erro ao reenviar email:', mailErr)
  }
})



/**
 * Verifica Email
 */
router.get('/verify-email', async (req, res) => {
  const { token } = req.query
  if (!token) return res.status(400).send('Token ausente.')

  const result = await prisma.user.updateMany({
    where: { verificationToken: token },
    data: {
      verified: true,
      verificationToken: null
    }
  })

  if (result.count === 0) {
    return res.status(400).send('Token inválido ou expirado.')
  }

  return res.send('Email verificado com sucesso. Você já pode fazer login.')
})



/**
 * LOGIN
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.status(401).json({ message: 'Usuário não encontrado, necessário criar uma conta.' })
  }

  if (!user.verified) {
    return res.status(403).json({
      message: 'Email não verificado.',
      code: 'EMAIL_NOT_VERIFIED'
    })
  }

  const validPassword = bcrypt.compareSync(password, user.password)

  if (!validPassword) {
    return res.status(401).json({ message: 'Senha inválida' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: '1h' }
  )

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000
  })

  res.json({ message: 'Login realizado com sucesso' })
})


/**
 * LOGOUT
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV
  })

  res.json({ message: 'Logout realizado' })
})


/**
 * ESQUECI MINHA SENHA
 */

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.json({
        message: 'Se o email existir, enviaremos instruções.'
      })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 6)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires
      }
    })

    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    await sendMail({
      to: user.email,
      subject: 'Redefinição de senha',
      html: `
        <p>Você solicitou a redefinição de senha.</p>
        <p><a href="${link}">Clique aqui para redefinir</a></p>
        <p>Este link expira em 30 minutos.</p>
          `,
      text: `Redefina sua senha: ${link}`
    })

    res.json({
      message: 'Se o email existir, enviaremos instruções.'
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Erro interno'
    })
  }
})

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body

  if (!token || !password) {
    return res.status(400).json({
      message: 'Dados inválidos.'
    })
  }

  try {
    const ONE_HOUR = 60 * 60 * 1000

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date(Date.now() + ONE_HOUR)  }
      }
    })

    if (!user) {
      return res.status(400).json({
        message: 'Token inválido ou expirado.'
      })
    }

    const hash = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hash,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    })

    return res.json({
      message: 'Senha redefinida com sucesso.'
    })

  } catch (err) {
    console.error('Erro reset-password:', err)
    return res.status(500).json({
      message: 'Erro interno'
    })
  }
})

module.exports = router
