// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const characterSchema = new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     imageUrl: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     element: {
//         type: Schema.Types.ObjectId,
//         ref: 'Element',
//         required: true
//     },
//     nation: {
//         type: String,
//         required: true
//     },
//     rarity: {
//         type: String,
//         required: true
//     },
//     weapon: {
//         type: String,
//         required: true
//     },
//     skillTalents: [{
//         type: Schema.Types.ObjectId,
//         ref: 'SkillTalent'
//     }],
//     passiveTalents: [{
//         type: Schema.Types.ObjectId,
//         ref: 'PassiveTallent'
//     }],
//     constellations: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Constellation'
//     }],
//     adcentMats: [{
//         type: Schema.Types.ObjectId,
//         ref: 'CharacterMaterial'
//     }],
//     talentMats: [{
//         type: Schema.Types.ObjectId,
//         ref: 'TalentMaterial'
//     }],
// })

// module.exports = mongoose.model('Character', characterSchema)
