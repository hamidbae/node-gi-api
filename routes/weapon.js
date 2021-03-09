const express = require('express')
const { getWeapons, addWeapon, updateWeapon, deleteWeapon } = require('../controllers/weapon')

const router = express.Router()

router.get('/', getWeapons)
router.post('/', addWeapon)
router.put('/:id', updateWeapon)
router.delete('/:id', deleteWeapon)

module.exports = router