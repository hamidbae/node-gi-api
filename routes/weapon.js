const express = require('express')
const { getWeapons, addWeapon, updateWeapon, deleteWeapon } = require('../controllers/weapon')

const { upload } = require('../utils/imageController')

const router = express.Router()

router.get('/', getWeapons)
router.post('/', upload.single('image'), addWeapon)
router.put('/:id', upload.single('image'), updateWeapon)
router.delete('/:id', deleteWeapon)

module.exports = router