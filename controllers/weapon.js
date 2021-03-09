const Weapon = require('../models/weapon')

module.exports.getWeapons = async (req, res) => {
    const weapons = await Weapon.find({})
    res.status(200).json({ weapons })
}

module.exports.addWeapon = async (req, res) => {
    const { name, imageUrl, type, rarity, atk, secondary, passive, bonus, location } = req.body

    const weapon = new Weapon({
        name,
        imageUrl,
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
}

module.exports.updateWeapon = async (req, res) => {
    let weapon = await Weapon.findById(req.params.id)
    const { name, imageUrl, rarity, set2, set4 } = req.body

    weapon.name = name
    weapon.imageUrl = imageUrl
    weapon.type = type
    weapon.rarity = rarity
    weapon.atk = atk
    weapon.secondary = secondary
    weapon.passive = passive
    weapon.bonus = bonus
    weapon.location = location

    await weapon.save()

    res.status(201).json({
        message: "weapon updated",
        weapon: weapon
    })
}

module.exports.deleteWeapon = async (req, res) => {
    const weapon = await Weapon.findById(req.params.id)

    await weapon.remove()
    
    res.json({ message: 'weapon deleted!'})
}