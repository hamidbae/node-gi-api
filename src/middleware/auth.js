import Admin from '../models/admin/admin.js'
import moment from 'moment'
import LOGGER from '../helper/logger.js'
import RESPONSE from '../helper/response.js'
import CONSTANT from '../helper/constant.js'
import tokenService from '../services/token.js'

const authMiddleware = async (req, res, next) => {
  const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
  let payload

  try {
    payload = tokenService.verifyTokenAuth(req)
    if (!payload) throw new Error('verify token false')

    const admin = await Admin.findOne({ email: payload.email })
    if (!admin) throw new Error('admin not found')

    payload._id = admin._id.toString()
    payload.role = admin.role
    res.locals.payload = payload
    next()
  } catch (err) {
    LOGGER.Error(err)
    res.status(401).json(RESPONSE(requestTime, 'Admin not authenticated', null, err))
  }
}

export default authMiddleware
