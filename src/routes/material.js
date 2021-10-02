import express from 'express'
import material from '../controllers/material.js'
import upload from '../helper/multer.js'
import { body } from 'express-validator'

const materialRouter = express.Router()

materialRouter.get('/', material.controller.getAll)
materialRouter.post(
  '/',
  [
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
    body('name', 'Please provide a name').notEmpty(),
    body('name', 'Name field must be string').isString(),
    body('type', 'Please provide a type').notEmpty(),
    body('type', 'Type file must be string').isString(),
    body('rarity', 'Please provide a rarity').notEmpty(),
    body('rarity', 'Rarity filed must be number').isNumeric(),
    body('obtain', 'Please provide obtain').notEmpty(),
    // body('obtain', 'Rarity field must be an array').custom((val) => {
    //   return Array.isArray(val)
    // }),
  ],
  material.controller.add
)
materialRouter.put(
  '/:id',
  [
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
    body('name').custom((val) => {
      if (val) {
        body('name', 'Name field must be string').isString()
      }
      return true
    }),
    body('type').custom((val) => {
      if (val) {
        body('type', 'Type field must be string').isString()
      }
      return true
    }),
    body('rarity').custom((val) => {
      if (val) {
        body('rarity', 'Rarity field must be a number').isFloat({ min: 1, max: 5 })
      }
      return true
    }),
    // body('obtain').custom((val) => {
    //   if (val) {
    //     body('obtain', 'Rarity field must be an array').custom((arr) => {
    //       return Array.isArray(arr)
    //     })
    //   }
    //   return true
    // }),
  ],
  material.controller.update
)
materialRouter.delete('/:id', material.controller.del)

export default materialRouter