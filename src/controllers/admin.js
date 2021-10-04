import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import moment from 'moment'
import CONSTANT from '../helper/constant.js'
import LOGGER from '../helper/logger.js'
import RESPONSE from '../helper/response.js'
import tokenService from '../services/token.js'
import EMAIL_CONTENT from '../helper/emailContent.js'
import Admin from '../models/admin/admin.js'
import OneTimeToken from '../models/admin/oneTimeToken.js'
import emailService from '../services/email.js'
import { v4 as uuidv4 } from 'uuid'

const login = async (req, res) => {
  const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement.', null, errors.array()))

  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email: email })
    // console.log(admin)
    if (!admin) {
      res.status(400).json(RESPONSE(requestTime, 'Email or password is incorrect.'))
    }

    // console.log(password, admin.password)
    const passwordCheck = await bcrypt.compare(password, admin.password)
    // console.log(passwordCheck)
    if (!passwordCheck) {
      res.status(400).json(RESPONSE(requestTime, 'Email or password is incorrect'))
    }

    const token = tokenService.signTokenAuth(admin.email)

    return res.status(200).json(RESPONSE(requestTime, 'Login success', { token }))
  } catch (err) {
    LOGGER.Error(err)
    return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
  }
}

const resetPassword = async (req, res) => {
  const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement.', null, errors.array()))
  }
  const email = req.body.email

  try {
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(400).json(RESPONSE(requestTime, 'Email is not registered'))
    }

    await OneTimeToken.deleteMany({ email })

    const token = uuidv4()
    const newToken = new OneTimeToken({
      email,
      token,
    })

    await newToken.save()

    const content = EMAIL_CONTENT.resetEmail(admin.email, token)
    await emailService.sendEmail(admin.email, 'Reset Password Confirmation', content)

    return res.status(200).json(RESPONSE(requestTime, 'Request reset password success'))
  } catch (err) {
    LOGGER.Error(err)
    return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
  }
}

const resetPasswordPage = async (req, res) => {
  const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(404).json(RESPONSE(requestTime, 'Invalid url'))
  const token = req.query.t

  try {
    const oneTimeToken = await OneTimeToken.findOne({ token })
    if (!oneTimeToken) return res.status(404).json(RESPONSE(requestTime, 'Invalid url'))
    const admin = await Admin.findOne({ email: oneTimeToken.email })
    if (!admin) return res.status(404).json(RESPONSE(requestTime, 'Invalid url'))

    res.render('resetPassword')
  } catch (err) {
    LOGGER.Error(err)
    return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
  }
}

const confirmResetPassword = async (req, res) => {
  const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement', null, errors.array()))
  // console.log('token', token)

  try {
    const token = req.query.t
    const { newPassword } = req.body
    const oneTimeToken = await OneTimeToken.findOne({ token })
    // console.log(oneTimeToken)
    if (!oneTimeToken) return res.status(404).json(RESPONSE(requestTime, 'Invalid url'))
    const admin = await Admin.findOne({ email: oneTimeToken.email })
    // console.log(admin)
    if (!admin) return res.status(404).json(RESPONSE(requestTime, 'Invalid url'))

    admin.password = await bcrypt.hash(newPassword, 10)

    await admin.save()
    await OneTimeToken.deleteOne({ token })
    return res.status(200).json(RESPONSE(requestTime, 'Reset password success'))
  } catch (err) {
    LOGGER.Error(err)
    return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
  }
}

const adminController = {
  login,
  resetPassword,
  resetPasswordPage,
  confirmResetPassword,
}

export default adminController
