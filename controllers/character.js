const Character = require('../models/character')
const SkillTalent = require('../models/skillTalent')
const PassiveTalent = require('../models/passiveTalent')
const Constellation = require('../models/constellation')

const { clearImage } = require('../utils/imageController')

module.exports.getCharacters = async (req, res) => {
    try{
        const characters = await Character.find({})
        res.status(200).json({ characters })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.addCharacter = async (req, res) => {
    try{
        const { name, description, element, nation, rarity, weapon } = req.body
        
        if(!req.file){
            const error = new Error('image required')
            error.statusCode = 422
            throw error
        }
        const character = new Character({
            name,
            imageUrl: req.file.path,
            description,
            element,
            nation,
            rarity,
            weapon
        })
    
        await character.save()
        res.status(201).json({
            message: 'An character added',
            character: character
        })
    }catch(error){
        console.log(error)
        res.status(402).json({ message: error.message })
    }
}

module.exports.updateCharacter = async (req, res) => {
    try{
        const { name, description, element, nation, rarity, weapon } = req.body
        let character = await Character.findById(req.params.id)

        if(req.file){
            clearImage(character.imageUrl)
        }
        
        character.name = name ? name : character.name
        character.imageUrl = req.file ? req.file.path : character.imageUrl
        character.description = description ? description : character.description
        character.element = element ? element : character.element
        character.nation = nation ? nation : character.nation
        character.rarity = rarity ? rarity : character.rarity
        character.weapon = weapon ? weapon : character.weapon
    
        await character.save()
    
        res.status(201).json({
            message: "character updated",
            character: character
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deleteCharacter = async (req, res) => {
    try{
        const character = await Character.findById(req.params.id)
        
        clearImage(character.imageUrl)
        await character.remove()
        
        res.json({ message: 'character deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.addSkillTalent = async (req, res) => {
    try{
        const { name, unlock, description } = req.body
        const character = await Character.findById(req.params.id)
        const skillTalent = new SkillTalent({
            name,
            unlock,
            description
        })
    
        await skillTalent.save()
        
        character.skillTalents.push(skillTalent)
        await character.save()

        res.status(201).json({
            message: 'An skillTalent added',
            skillTalent: skillTalent
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.getSkillTalents = async (req, res) => {
    try{
        const skillTalents = await SkillTalent.find({})
    
        res.status(201).json({
            skillTalent: skillTalents
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.updateSkillTalent = async (req, res) => {
    try{
        const { name, unlock, description } = req.body

        let skillTalent = await SkillTalent.findById(req.params.skill_id)
        
        skillTalent.name = name ? name : skillTalent.name
        skillTalent.unlock = unlock ? unlock : skillTalent.unlock
        skillTalent.description = description ? description : skillTalent.description
    
        await skillTalent.save()
    
        res.status(201).json({
            message: "skillTalent updated",
            skillTalent: skillTalent
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deleteSkillTalent = async (req, res) => {
    try{
        const skillTalent = await SkillTalent.findById(req.params.skill_id)
        
        await skillTalent.remove()
        
        res.json({ message: 'skillTalent deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

// passive talent
module.exports.addPassiveTalent = async (req, res) => {
    try{
        const { name, unlock, description } = req.body
        const character = await Character.findById(req.params.id)
        const passiveTalent = new PassiveTalent({
            name,
            unlock,
            description
        })
    
        await passiveTalent.save()
        
        character.passiveTalents.push(passiveTalent)
        await character.save()

        res.status(201).json({
            message: 'An passiveTalent added',
            passiveTalent: passiveTalent
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.getPassiveTalents = async (req, res) => {
    try{
        const passiveTalents = await PassiveTalent.find({})
    
        res.status(201).json({
            passiveTalent: passiveTalents
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.updatePassiveTalent = async (req, res) => {
    try{
        const { name, unlock, description } = req.body

        let passiveTalent = await PassiveTalent.findById(req.params.passive_id)
        
        passiveTalent.name = name ? name : passiveTalent.name
        passiveTalent.unlock = unlock ? unlock : passiveTalent.unlock
        passiveTalent.description = description ? description : passiveTalent.description
    
        await passiveTalent.save()
    
        res.status(201).json({
            message: "passiveTalent updated",
            passiveTalent: passiveTalent
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deletePassiveTalent = async (req, res) => {
    try{
        const passiveTalent = await PassiveTalent.findById(req.params.passive_id)
        
        await passiveTalent.remove()
        
        res.json({ message: 'passiveTalent deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

// constellation
module.exports.addConstellation = async (req, res) => {
    try{
        const { name, unlock, description } = req.body
        const character = await Character.findById(req.params.id)
        const constellation = new Constellation({
            name,
            unlock,
            description
        })
    
        await constellation.save()
        
        character.constellations.push(constellation)
        await character.save()

        res.status(201).json({
            message: 'An constellation added',
            constellation: constellation
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.getConstellations = async (req, res) => {
    try{
        const constellations = await Constellation.find({})
    
        res.status(201).json({
            constellation: constellations
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.updateConstellation = async (req, res) => {
    try{
        const { name, unlock, description } = req.body

        let constellation = await Constellation.findById(req.params.constellation_id)
        
        constellation.name = name ? name : constellation.name
        constellation.unlock = unlock ? unlock : constellation.unlock
        constellation.description = description ? description : constellation.description
    
        await constellation.save()
    
        res.status(201).json({
            message: "constellation updated",
            constellation: constellation
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deleteConstellation = async (req, res) => {
    try{
        const constellation = await Constellation.findById(req.params.constellation_id)
        
        await constellation.remove()
        
        res.json({ message: 'constellation deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}