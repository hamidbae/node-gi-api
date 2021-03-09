const express = require('express')
const { getArtifacts, addArtifact, updateArtifact, deleteArtifact } = require('../controllers/artifact')

const { upload } = require('../utils/imageController')

const router = express.Router()

router.get('/', getArtifacts)
router.post('/', upload.single('image'), addArtifact)
router.put('/:id', upload.single('image'), updateArtifact)
router.delete('/:id', deleteArtifact)

module.exports = router