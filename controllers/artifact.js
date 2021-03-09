const Artifact = require('../models/artifact')

const { clearImage } = require('../utils/imageController')

module.exports.getArtifacts = async (req, res) => {
    try{
        const artifacts = await Artifact.find({})
        res.status(200).json({ artifacts })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.addArtifact = async (req, res) => {
    try{
        const { name, rarity, set2, set4 } = req.body
        const artifact = new Artifact({
            name,
            imageUrl: req.file.path,
            rarity,
            set2,
            set4
        })
    
        await artifact.save()
        res.status(201).json({
            message: 'An artifact added',
            artifact: artifact
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.updateArtifact = async (req, res) => {
    try{
        let artifact = await Artifact.findById(req.params.id)
        const { name, rarity, set2, set4 } = req.body

        clearImage(artifact.imageUrl)
    
        artifact.name = name ? name : artifact.name
        artifact.imageUrl = req.file.path ? req.file.path : artifact.imageUrl
        artifact.rarity = rarity ? rarity : artifact.rarity
        artifact.set2 = set2 ? set2 : artifact.set2
        artifact.set4 = set4 ? set4 : artifact.set4
    
        await artifact.save()
    
        res.status(201).json({
            message: "artifact updated",
            artifact: artifact
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deleteArtifact = async (req, res) => {
    try{
        const artifact = await Artifact.findById(req.params.id)
        
        clearImage(artifact.imageUrl)
        await artifact.remove()
        
        res.json({ message: 'artifact deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}