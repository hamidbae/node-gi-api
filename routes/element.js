const express = require('express')
const { getElements, addElement, updateElement, deleteElement } = require('../controllers/element')
const { getElementDebuffs, addElementDebuff, updateElementDebuff, deleteElementDebuff } = require('../controllers/element')
const { getElementReactions, addElementReaction, updateElementReaction, deleteElementReaction } = require('../controllers/element')
const { getElementResonances, addElementResonance, updateElementResonance, deleteElementResonance } = require('../controllers/element')

const { upload } = require('../utils/imageController')

const router = express.Router()

router.get('/', getElements)
router.post('/', upload.single('image'), addElement)
router.put('/:id', upload.single('image'), updateElement)
router.delete('/:id', deleteElement)

router.get('/debuffs', getElementDebuffs)
router.post('/debuff', addElementDebuff)
router.put('/debuff/:id', updateElementDebuff)
router.delete('/debuff/:id', deleteElementDebuff)

router.get('/reactions', getElementReactions)
router.post('/reaction', addElementReaction)
router.put('/reaction/:id', updateElementReaction)
router.delete('/reaction/:id', deleteElementReaction)

router.get('/resonances', getElementResonances)
router.post('/resonance', addElementResonance)
router.put('/resonance/:id', updateElementResonance)
router.delete('/resonance/:id', deleteElementResonance)


module.exports = router