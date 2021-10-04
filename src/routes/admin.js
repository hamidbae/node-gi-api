import express from 'express'
import { body, query } from 'express-validator'
import adminController from '../controllers/admin.js'

const adminRouter = express.Router()

adminRouter.post(
  '/login',
  [
    body('email', 'Please provide a email').notEmpty(),
    body('email', 'Email field must be string').isEmail(),
    body('password', 'Please provide a password').notEmpty(),
    body('password', 'Password length must be at least 8 char').isLength({ min: 8 }),
    body('password', 'Password field must be string').isString(),
  ],
  adminController.login
)

adminRouter.post(
  '/reset-password',
  [body('email', 'Please provide a email').notEmpty(), body('email', 'Email field must be string').isEmail()],
  adminController.resetPassword
)

adminRouter.get('/confirm-reset-password', [query('t', 'Please privide a valid token').isUUID(4)], adminController.resetPasswordPage)
adminRouter.post(
  '/confirm-reset-password',
  [
    query('t', 'Please provide a valid token').isUUID(4),
    body('newPassword', 'New password must at least 8 digit string').isLength({
      min: 8,
    }),
  ],
  adminController.confirmResetPassword
)

export default adminRouter
