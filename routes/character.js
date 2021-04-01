const express = require('express')
const { getCharacters, addCharacter, updateCharacter, deleteCharacter } = require('../controllers/character')
const { getSkillTalents, addSkillTalent, updateSkillTalent, deleteSkillTalent } = require('../controllers/character')
const { getPassiveTalents, addPassiveTalent, updatePassiveTalent, deletePassiveTalent } = require('../controllers/character')
const { getConstellations, addConstellation, updateConstellation, deleteConstellation } = require('../controllers/character')

const { upload } = require('../utils/imageController')

const router = express.Router()

router.get('/', getCharacters)
router.post('/', upload.single('image'), addCharacter)
router.put('/:id', upload.single('image'), updateCharacter)
router.delete('/:id', deleteCharacter)

router.get('/skill/', getSkillTalents)
router.post('/skill/:id', addSkillTalent)
router.put('/skill/:skill_id', updateSkillTalent)
router.delete('/skill/:skill_id', deleteSkillTalent)

router.get('/passive/', getPassiveTalents)
router.post('/passive/:id', addPassiveTalent)
router.put('/passive/:passive_id', updatePassiveTalent)
router.delete('/passive/:passive_id', deletePassiveTalent)

router.get('/constellation/', getConstellations)
router.post('/constellation/:id', addConstellation)
router.put('/constellation/:constellation_id', updateConstellation)
router.delete('/constellation/:constellation_id', deleteConstellation)

module.exports = router