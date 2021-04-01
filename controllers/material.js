const CharacterMaterial = require('../models/characterMaterial')
const TalentMaterial = require('../models/talentMaterial')

const { clearImage } = require('../utils/imageController')

// character adcent mat
module.exports.getCharacterMaterials = async (req, res) => {
    try{
        const characterMaterials = await CharacterMaterial.find({})
        res.status(200).json({ characterMaterials })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.addCharacterMaterial = async (req, res) => {
    try{
        const { name } = req.body
        const characterMaterial = new CharacterMaterial({
            name,
            imageUrl: req.file.path,
        })
    
        await characterMaterial.save()
        res.status(201).json({
            message: 'An characterMaterial added',
            characterMaterial: characterMaterial
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.updateCharacterMaterial = async (req, res) => {
    try{
        const { name } = req.body
        let characterMaterial = await CharacterMaterial.findById(req.params.id)

        if(req.file){
            clearImage(characterMaterial.imageUrl)
        }
        
        characterMaterial.name = name ? name : characterMaterial.name
        characterMaterial.imageUrl = req.file ? req.file.path : characterMaterial.imageUrl
    
        await characterMaterial.save()
    
        res.status(201).json({
            message: "characterMaterial updated",
            characterMaterial: characterMaterial
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deleteCharacterMaterial = async (req, res) => {
    try{
        const characterMaterial = await CharacterMaterial.findById(req.params.id)
        
        clearImage(characterMaterial.imageUrl)
        await characterMaterial.remove()
        
        res.json({ message: 'characterMaterial deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

// character talent mat
module.exports.getTalentMaterials = async (req, res) => {
    try{
        const talentMaterials = await TalentMaterial.find({})
        res.status(200).json({ talentMaterials })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.addTalentMaterial = async (req, res) => {
    try{
        const { name, obtain, enableDay } = req.body
        const talentMaterial = new TalentMaterial({
            name,
            imageUrl: req.file.path,
            obtain,
            enableDay
        })
    
        await talentMaterial.save()
        res.status(201).json({
            message: 'A talent material added',
            talentMaterial: talentMaterial
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.updateTalentMaterial = async (req, res) => {
    try{
        const { name, obtain, enableDay } = req.body
        let talentMaterial = await TalentMaterial.findById(req.params.id)

        if(req.file){
            clearImage(talentMaterial.imageUrl)
        }
        
        talentMaterial.name = name ? name : talentMaterial.name
        talentMaterial.imageUrl = req.file ? req.file.path : talentMaterial.imageUrl
        talentMaterial.obtain = obtain ? obtain : talentMaterial.obtain
        talentMaterial.enableDay = enableDay ? enableDay : talentMaterial.enableDay
    
        await talentMaterial.save()
    
        res.status(201).json({
            message: "talent material updated",
            talentMaterial: talentMaterial
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deleteTalentMaterial = async (req, res) => {
    try{
        const talentMaterial = await TalentMaterial.findById(req.params.id)
        
        clearImage(talentMaterial.imageUrl)
        await talentMaterial.remove()
        
        res.json({ message: 'talent material deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}