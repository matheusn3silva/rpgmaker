const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const prisma = require('../lib/prisma')

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {

        try {
          const email = profile.emails?.[0]?.value
          const name = profile.displayName || ''

          if (!email) {
            return done(new Error('Google profile sem email'), null)
          }

          let user = await prisma.user.findUnique({
            where: { email }
          })

          if (user) {
            return done(null, user)
          }

          user = await prisma.user.create({
            data: {
              name,
              email,
              password: '',
              verified: true
            }
          })

          return done(null, user)
        } catch (error) {
          return done(error, null)
        }
      }))
} else {
  console.warn('⚠️  Google OAuth não configurado — login com Google desabilitado');
}

