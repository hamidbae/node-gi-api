const mongoose = require('mongoose')
const Schema = mongoose.Schema

const weaponSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: "url"
    },
    type: {
        type: String,
        required: true
    },
    rarity: {
        type: Number,
        required: true
    },
    atk: {
        type: Number,
        required: true
    },
    secondary: String,
    passive: String,
    bonus: String,
    location: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Artifact', weaponSchema)