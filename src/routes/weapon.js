import express from 'express'
import { body } from 'express-validator'
import weapon from '../controllers/weapon.js'
import upload from '../helper/multer.js'
import auth from '../middleware/auth.js'

const weaponRouter = express.Router()

/*
weapon controller

fields:
  name
  type
  rarity
  obtain
  series
  image1Url
  image1Id
  image2Url
  image2Id
  iconUrl
  iconId
  weaponLvStats
  refinementStats
  ascensionMaterials
*/

weaponRouter.get('/', weapon.controller.getAll)
weaponRouter.get('/:weaponId', weapon.controller.getOne)
weaponRouter.post(
  '/',
  [
    auth,
    upload.fields([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
    body('name', 'Please provide a name').notEmpty(),
    body('name', 'name field must be string').isString(),
    body('type', 'Please provide a type').notEmpty(),
    body('type', 'type field must be string').isString(),
    body('rarity', 'Please provide a rarity').notEmpty(),
    body('rarity', 'rarity field must be a number').isNumeric(),
    body('obtain', 'Please provide a obtain').notEmpty(),
    body('obtain', 'obtain field must be string').isString(),
    body('series', 'Please provide a series').notEmpty(),
    body('series', 'series field must be string').isString(),
  ],
  weapon.controller.add
)
weaponRouter.put(
  '/:id',
  [
    auth,
    upload.fields([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
    body('name').custom((val) => {
      if (val) {
        body('name', 'name field must be string').isString()
      }
      return true
    }),
    body('type').custom((val) => {
      if (val) {
        body('type', 'type field must be string').isString()
      }
      return true
    }),
    body('rarity').custom((val) => {
      if (val) {
        body('rarity', 'rarity field must be number').isNumeric()
      }
      return true
    }),
    body('obtain').custom((val) => {
      if (val) {
        body('obtain', 'obtain field must be string').isString()
      }
      return true
    }),
    body('series').custom((val) => {
      if (val) {
        body('series', 'series field must be string').isString()
      }
      return true
    }),
  ],
  weapon.controller.update
)
weaponRouter.delete('/:id', auth, weapon.controller.del)

/*
weapon level statistic router

fields:
  weaponId
  ascensionPhase
  lowLv
  highLv
  lowAtk
  highAtk
  lowSecondStat
  highSecondStat
*/

weaponRouter.get('/lv-statistic/', weapon.levelController.getAll)
weaponRouter.post(
  '/lv-statistic/',
  [
    auth,
    body('weaponId', 'Please provide a weaponId').notEmpty(),
    body('weaponId', 'weaponId field must be string').isString(),
    body('ascensionPhase', 'Please provide a ascensionPhase').notEmpty(),
    body('ascensionPhase', 'ascensionPhase field must be a number').isNumeric(),
    body('lowLv', 'Please provide a lowLv').notEmpty(),
    body('lowLv', 'lowLv field must be a number').isNumeric(),
    body('highLv', 'Please provide a highLv').notEmpty(),
    body('highLv', 'highLv field must be a number').isNumeric(),
    body('lowAtk', 'Please provide a lowAtk').notEmpty(),
    body('lowAtk', 'lowAtk field must be a number').isNumeric(),
    body('highAtk', 'Please provide a highAtk').notEmpty(),
    body('highAtk', 'highAtk field must be a number').isNumeric(),
    body('lowSecondStat', 'Please provide a lowSecondStat').notEmpty(),
    body('lowSecondStat', 'lowSecondStat must be string').isString(),
    body('highSecondStat', 'Please provide a highSecondStat').notEmpty(),
    body('highSecondStat', 'highSecondStat field must be a string').isString(),
  ],
  weapon.levelController.add
)
weaponRouter.put(
  '/lv-statistic/:id',
  [
    auth,
    body('weaponId').custom((val) => {
      if (val) {
        body('weaponId', 'weaponId field must be string').isString()
      }
      return true
    }),
    body('ascensionPhase').custom((val) => {
      if (val) {
        body('ascensionPhase', 'ascensionPhase field must be number').isNumeric()
      }
      return true
    }),
    body('lowLv').custom((val) => {
      if (val) {
        body('lowLv', 'lowLv field must be number').isNumeric()
      }
      return true
    }),
    body('highLv').custom((val) => {
      if (val) {
        body('highLv', 'highLv field must be number').isNumeric()
      }
      return true
    }),
    body('lowAtk').custom((val) => {
      if (val) {
        body('lowAtk', 'lowAtk field must be number').isNumeric()
      }
      return true
    }),
    body('highAtk').custom((val) => {
      if (val) {
        body('highAtk', 'highAtk field must be number').isNumeric()
      }
      return true
    }),
    body('lowSecondStat').custom((val) => {
      if (val) {
        body('lowSecondStat', 'lowSecondStat field must be string').isString()
      }
      return true
    }),
    body('highSecondStat').custom((val) => {
      if (val) {
        body('highSecondStat', 'highSecondStat field must be string').isString()
      }
      return true
    }),
  ],
  weapon.levelController.update
)
weaponRouter.delete('/lv-statistic/:id', auth, weapon.levelController.del)

// weapon refinement router
// field : weaponId, refinementLv, cost, statsTitle, statsDescription,

weaponRouter.get('/refinement/', weapon.refinementController.getAll)
weaponRouter.post(
  '/refinement/',
  [
    auth,
    body('weaponId', 'Please provide a weaponId').notEmpty(),
    body('weaponId', 'weaponId field must be string').isString(),
    body('refinementLv', 'Please provide a refinementLv').notEmpty(),
    body('refinementLv', 'refinementLv field must be a number').isNumeric(),
    body('cost', 'Please provide a cost').notEmpty(),
    body('cost', 'cost field must be a number').isNumeric(),
    body('statsTitle', 'Please provide a statsTitle').notEmpty(),
    body('statsTitle', 'statsTitle must be string').isString(),
    body('statsDescription', 'Please provide a statsDescription').notEmpty(),
    body('statsDescription', 'statsDescription field must be a string').isString(),
  ],
  weapon.refinementController.add
)
weaponRouter.put(
  '/refinement/:id',
  [
    auth,
    body('weaponId').custom((val) => {
      if (val) {
        body('weaponId', 'weaponId field must be string').isString()
      }
      return true
    }),
    body('refinementLv').custom((val) => {
      if (val) {
        body('refinementLv', 'refinementLv field must be number').isNumeric()
      }
      return true
    }),
    body('cost').custom((val) => {
      if (val) {
        body('cost', 'cost field must be number').isNumeric()
      }
      return true
    }),
    body('statsTitle').custom((val) => {
      if (val) {
        body('statsTitle', 'statsTitle field must be string').isString()
      }
      return true
    }),
    body('statsDescription').custom((val) => {
      if (val) {
        body('statsDescription', 'statsDescription field must be string').isString()
      }
      return true
    }),
  ],
  weapon.refinementController.update
)
weaponRouter.delete('/refinement/:id', weapon.refinementController.del)

// weapon ascension material router
// field :
// ascensionPhaseTo
// cost
// weaponMaterialId
// weaponMaterialTotal
// commonMaterial1Id
// commonMaterial1Total
// commonMaterial2Id
// commonMaterial2Total

weaponRouter.get('/ascension-materials/', weapon.ascensionMaterialController.getAll)
weaponRouter.post(
  '/ascension-materials/',
  [
    auth,
    body('ascensionPhaseTo', 'Please provide a ascensionPhaseTo').notEmpty(),
    body('ascensionPhaseTo', 'ascensionPhaseTo field must be a number between 1-6').isFloat({
      min: 1,
      max: 6,
    }),
    body('cost', 'Please provide a cost').notEmpty(),
    body('cost', 'cost field must be a number').isNumeric(),
    body('weaponMaterialId', 'Please provide a weaponMaterialId').notEmpty(),
    body('weaponMaterialId', 'weaponMaterialId field must be a string').isString(),
    body('weaponMaterialTotal', 'Please provide a weaponMaterialTotal').notEmpty(),
    body('weaponMaterialTotal', 'weaponMaterialTotal must be a number').isNumeric(),
    body('commonMaterial1Id', 'Please provide a commonMaterial1Id').notEmpty(),
    body('commonMaterial1Id', 'commonMaterial1Id field must be a string').isString(),
    body('commonMaterial1Total', 'Please provide a commonMaterial1Total').notEmpty(),
    body('commonMaterial1Total', 'commonMaterial1Total field must be a string').isNumeric(),
    body('commonMaterial2Id', 'Please provide a commonMaterial2Id').notEmpty(),
    body('commonMaterial2Id', 'commonMaterial2Id field must be a string').isString(),
    body('commonMaterial2Total', 'Please provide a commonMaterial2Total').notEmpty(),
    body('commonMaterial2Total', 'commonMaterial2Total field must be a string').isNumeric(),
  ],
  weapon.ascensionMaterialController.add
)
weaponRouter.put(
  '/ascension-materials/:id',
  [
    auth,
    body('ascensionPhaseTo').custom((val) => {
      if (val) {
        body('ascensionPhaseTo', 'AscensionPhaseTo field must be number between 1-6').isFloat({ min: 1, max: 6 })
      }
      return true
    }),
    body('cost').custom((val) => {
      if (val) {
        body('cost', 'Cost field must be number').isNumeric()
      }
      return true
    }),
    body('weaponMaterialId').custom((val) => {
      if (val) {
        body('weaponMaterialId', 'WeaponMaterialId field must be string').isString()
      }
      return true
    }),
    body('weaponMaterialTotal').custom((val) => {
      if (val) {
        body('weaponMaterialTotal', 'WeaponMaterialTotal field must be a number').isNumeric()
      }
      return true
    }),
    body('commonMaterial1Id').custom((val) => {
      if (val) {
        body('commonMaterial1Id', 'CommonMaterial1Id field must be string').isString()
      }
      return true
    }),
    body('commonMaterial1Total').custom((val) => {
      if (val) {
        body('commonMaterial1Total', 'CommonMaterial1Total field must be a number').isNumeric()
      }
      return true
    }),
    body('commonMaterial2Id').custom((val) => {
      if (val) {
        body('commonMaterial2Id', 'CommonMaterial2Id field must be string').isString()
      }
      return true
    }),
    body('commonMaterial2Total', 'Please provide a commonMaterial2Total').custom((val) => {
      if (val) {
        body('commonMaterial2Total', 'CommonMaterial2Total field must be a number').isNumeric()
      }
      return true
    }),
  ],
  weapon.ascensionMaterialController.update
)
weaponRouter.delete('/ascension-materials/:id', auth, weapon.ascensionMaterialController.del)

export default weaponRouter
