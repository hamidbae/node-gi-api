const mongoose = require('mongoose')
const Schema = mongoose.Schema

const elementReaction = new Schema({
    name: {
        type: String,
        required: true
    },
    element1: {
        type: Schema.Types.ObjectId,
        ref: 'Element',
        required: true
    },
    element2: {
        type: Schema.Types.ObjectId,
        ref: 'Element',
        required: true
    },
    effect: {
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model('ElementReaction', elementReaction)