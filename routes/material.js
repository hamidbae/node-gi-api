const express = require('express')
const { getCharacterMaterials, addCharacterMaterial, updateCharacterMaterial, deleteCharacterMaterial } = require('../controllers/material')
const { getTalentMaterials, addTalentMaterial, updateTalentMaterial, deleteTalentMaterial } = require('../controllers/material')

const { upload } = require('../utils/imageController')

const router = express.Router()

// character adcent mat
router.get('/character/', getCharacterMaterials)
router.post('/character/', upload.single('image'), addCharacterMaterial)
router.put('/character/:id', upload.single('image'), updateCharacterMaterial)
router.delete('/character/:id', deleteCharacterMaterial)

// character talent mat
router.get('/talent/', getTalentMaterials)
router.post('/talent/', upload.single('image'), addTalentMaterial)
router.put('/talent/:id', upload.single('image'), updateTalentMaterial)
router.delete('/talent/:id', deleteTalentMaterial)

module.exports = router