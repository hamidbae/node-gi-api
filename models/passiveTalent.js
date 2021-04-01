const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passiveTalentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    unlock: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('PassiveTalent', passiveTalentSchema)