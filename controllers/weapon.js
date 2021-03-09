const Weapon = require('../models/weapon')

const { clearImage } = require('../utils/imageController')

module.exports.getWeapons = async (req, res) => {
    try{
        const weapons = await Weapon.find({})
        res.status(200).json({ weapons })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.addWeapon = async (req, res) => {
    try{
        const { name, type, rarity, atk, secondary, passive, bonus, location } = req.body

        const weapon = new Weapon({
            name,
            imageUrl: req.file.path,
            type,
            rarity,
            atk,
            secondary,
            passive,
            bonus,
            location
        })

        await weapon.save()
        res.status(201).json({
            message: 'An weapon added',
            weapon: weapon
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.updateWeapon = async (req, res) => {
    try{
        const { name, type, rarity, atk, secondary, passive, bonus, location } = req.body
        let weapon = await Weapon.findById(req.params.id)

        if(req.file){
            clearImage(weapon.imageUrl)
        }

        weapon.name = name ? name : weapon.name
        weapon.imageUrl = req.file ? req.file.path : weapon.imageUrl
        weapon.type = type ? type : weapon.type
        weapon.rarity = rarity ? rarity : weapon.rarity
        weapon.atk = atk ? atk : weapon.atk
        weapon.secondary = secondary ? secondary : weapon.secondary
        weapon.passive = passive ? passive : weapon.passive
        weapon.bonus = bonus ? bonus : weapon.bonus
        weapon.location = location ? location : weapon.location

        await weapon.save()

        res.status(201).json({
            message: "weapon updated",
            weapon: weapon
        })
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}

module.exports.deleteWeapon = async (req, res) => {
    try{
        const weapon = await Weapon.findById(req.params.id)

        clearImage(weapon.imageUrl)

        await weapon.remove()
        
        res.json({ message: 'weapon deleted!'})
    }catch(error){
        res.status(402).json({ message: error.message })
    }
}