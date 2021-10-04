import nodemailer from 'nodemailer'
import CONSTANT from '../helper/constant.js'

const transporter = nodemailer.createTransport({
  host: CONSTANT.EMAIL_HOST,
  port: CONSTANT.EMAIL_PORT,
  requireTLS: true,
  logger: true,
  auth: {
    user: CONSTANT.EMAIL_USER,
    pass: CONSTANT.EMAIL_PASS,
  },
})

transporter.verify().then(console.info).catch(console.error)

const emailService = {
  sendEmail: (to, subject, content) =>
    new Promise((resolve, reject) => {
      transporter
        .sendMail({
          from: `${CONSTANT.AUTHOR} <${CONSTANT.EMAIL_USER}>`,
          to,
          subject,
          html: content,
          //   bcc: "xxreyl@gmail.com", // TEMPORARY WHILE TESTING
        })
        .then((info) => resolve(info))
        .catch((e) => reject(e))
    }),
}

export default emailService
