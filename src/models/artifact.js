const mongoose = require('mongoose')
const Schema = mongoose.Schema

const artifactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: "url"
    },
    rarity: {
        type: Number,
        required: true
    },
    set2: {
        type: String,
        required: true
    },
    set4: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Artifact', artifactSchema)