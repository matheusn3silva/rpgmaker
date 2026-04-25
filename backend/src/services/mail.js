require('dotenv').config()
const { Resend } = require('resend')

const FROM = process.env.EMAIL_FROM || 'RPG Maker <noreply@rpgmaker.com>'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

if (!resend) {
  console.warn('RESEND_API_KEY não definido — emails não serão enviados.')
}

async function sendMail({ to, subject, html, text }) {
  if (!resend) {
    console.log('DEV EMAIL (não enviado):', { to, subject, text, html })
    return
  }

  if (!to) {
    throw new Error('Email de destino (to) não informado')
  }

  const safeText = text?.trim() || ' '
  const safeHtml = html?.trim() || `<p>${safeText}</p>`

  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html: safeHtml,
    text: safeText,
  })

  if (error) {
    console.error('Resend API Error:', error)
    throw new Error(error.message)
  }

  return data
}


module.exports = sendMail
