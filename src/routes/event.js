import express from 'express'
import event from '../controllers/event.js'
import upload from '../helper/multer.js'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'

const eventRouter = express.Router()

eventRouter.get('/', event.controller.getAll)
eventRouter.get('/:eventId', event.controller.getOne)
eventRouter.post(
  '/',
  [
    auth,
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
    body('title', 'Please provide a title').notEmpty(),
    body('title', 'Name field must be string').isString(),
    body('status', 'Please provide a status').notEmpty(),
    body('status', 'Type file must be string').isString(),
    body('description', 'Please provide a description').notEmpty(),
    body('description', 'Rarity filed must be number').isString(),
    body('startDate', 'Please provide a startDate').notEmpty(),
    body('startDate', 'Rarity filed must be number').isString(),
    body('endDate', 'Please provide a endDate').notEmpty(),
    body('endDate', 'Rarity filed must be number').isString(),
  ],
  event.controller.add
)
eventRouter.put(
  '/:id',
  [
    auth,
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
    body('title').custom((val) => {
      if (val) {
        body('title', 'Title field must be string').isString()
      }
      return true
    }),
    body('status').custom((val) => {
      if (val) {
        body('status', 'Status field must be string').isString()
      }
      return true
    }),
    body('description').custom((val) => {
      if (val) {
        body('description', 'Description field must be a string').isString()
      }
      return true
    }),
    body('startDate').custom((val) => {
      if (val) {
        body('startDate', 'Date start field must be a string').isString()
      }
      return true
    }),
    body('endDate').custom((val) => {
      if (val) {
        body('endDate', 'Date end field must be a string').isString()
      }
      return true
    }),
  ],
  event.controller.update
)
eventRouter.delete('/:id', auth, event.controller.del)

export default eventRouter
