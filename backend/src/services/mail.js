// src/services/mail.js
require('dotenv').config()
const sgMail = require('@sendgrid/mail')

const FROM = process.env.EMAIL_FROM

if (!process.env.SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY não definido — emails não serão enviados.')
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

async function sendMail({ to, subject, html, text }) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('DEV EMAIL (não enviado):', { to, subject, text, html })
    return
  }

  if (!to) {
    throw new Error('Email de destino (to) não informado')
  }

  const safeText = text && text.trim() ? text : ' '
  const safeHtml = html && html.trim()
    ? html
    : `<p>${safeText}</p>`

  const msg = {
    to,
    from: FROM,
    subject,
    text: safeText,
    html: safeHtml
  }

  await sgMail.send(msg)
}


module.exports = sendMail
