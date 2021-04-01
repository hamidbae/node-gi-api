const mongoose = require('mongoose')
const Schema = mongoose.Schema

const elementResonance = new Schema({
    name: {
        type: String,
        required: true
    },
    requirements: [{
        type: Schema.Types.ObjectId,
        ref: 'Element',
        required: true
    }],
    effect: {
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model('ElementResonance', elementResonance)