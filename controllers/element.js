const Element = require('../models/element')
const ElementDebuff = require('../models/elementDebuff')
const ElementReaction = require('../models/elementReaction')
const ElementResonance = require('../models/elementResonance')

const { clearImage } = require('../utils/imageController')

// elemen crud
module.exports.getElements = async (req, res) => {
    try{
        const elements = await Element.find({})
        res.status(200).json({ elements })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.addElement = async (req, res) => {
    try{
        const { name } = req.body
        const element = new Element({
            name,
            imageUrl: req.file.path,
        })
    
        await element.save()
        res.status(201).json({
            message: 'An element added',
            element: element
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.updateElement = async (req, res) => {
    try{
        const { name } = req.body
        let element = await Element.findById(req.params.id)

        if(req.file){
            clearImage(element.imageUrl)
        }
        
        element.name = name ? name : element.name
        element.imageUrl = req.file ? req.file.path : element.imageUrl
    
        await element.save()
    
        res.status(201).json({
            message: "element updated",
            element: element
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deleteElement = async (req, res) => {
    try{
        const element = await Element.findById(req.params.id)
        
        clearImage(element.imageUrl)
        await element.remove()
        
        res.json({ message: 'element deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

// Elemental debuff crud
module.exports.getElementDebuffs = async (req, res) => {
    try{
        const debuffs = await ElementDebuff.find({})
        res.status(200).json({ debuffs })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.addElementDebuff = async (req, res) => {
    try{
        const { name, requirement, effect } = req.body
        const debuff = new ElementDebuff({
            name,
            requirement,
            effect
        })
    
        await debuff.save()
        res.status(201).json({
            message: 'Debuff added',
            debuff
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.updateElementDebuff = async (req, res) => {
    try{
        const { name, requirement, effect } = req.body
        let debuff = await ElementDebuff.findById(req.params.id)
        
        debuff.name = name ? name : debuff.name
        debuff.requirement = requirement ? requirement : debuff.requirement
        debuff.effect = effect ? effect : debuff.effect
    
        await debuff.save()
    
        res.status(201).json({
            message: "debuff updated",
            debuff
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deleteElementDebuff = async (req, res) => {
    try{
        const debuff = await ElementDebuff.findById(req.params.id)
        
        await debuff.remove()
        
        res.json({ message: 'debuff deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

// Elemental reaction crud
module.exports.getElementReactions = async (req, res) => {
    try{
        const reactions = await ElementReaction.find({})
        res.status(200).json({ reactions })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.addElementReaction = async (req, res) => {
    try{
        const { name, element1, element2, effect } = req.body
        const reaction = new ElementReaction({
            name,
            element1,
            element2,
            effect
        })
    
        await reaction.save()
        res.status(201).json({
            message: 'Reaction added',
            reaction
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.updateElementReaction = async (req, res) => {
    try{
        const { name, element1, element2, effect } = req.body
        let reaction = await ElementReaction.findById(req.params.id)
        
        reaction.name = name ? name : reaction.name
        reaction.element1 = element1 ? element1 : reaction.element1
        reaction.element2 = element2 ? element2 : reaction.element2
        reaction.effect = effect ? effect : reaction.effect
    
        await reaction.save()
    
        res.status(201).json({
            message: "reaction updated",
            reaction
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deleteElementReaction = async (req, res) => {
    try{
        const reaction = await ElementReaction.findById(req.params.id)
        
        await reaction.remove()
        
        res.json({ message: 'reaction deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

// Elemental resonance crud
module.exports.getElementResonances = async (req, res) => {
    try{
        const resonances = await ElementResonance.find({})
        res.status(200).json({ resonances })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.addElementResonance = async (req, res) => {
    try{
        const { name, requirements, effect } = req.body
        const resonance = new ElementResonance({
            name,
            requirements,
            effect
        })
    
        await resonance.save()
        res.status(201).json({
            message: 'Resonance added',
            resonance
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.updateElementResonance = async (req, res) => {
    try{
        const { name, requirements, effect } = req.body
        let resonance = await ElementResonance.findById(req.params.id)
        
        resonance.name = name ? name : resonance.name
        resonance.requirements = requirements ? requirements : resonance.requirements
        resonance.effect = effect ? effect : resonance.effect
    
        await resonance.save()
    
        res.status(201).json({
            message: "resonance updated",
            resonance
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deleteElementResonance = async (req, res) => {
    try{
        const resonance = await ElementResonance.findById(req.params.id)
        
        await resonance.remove()
        
        res.json({ message: 'resonance deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}