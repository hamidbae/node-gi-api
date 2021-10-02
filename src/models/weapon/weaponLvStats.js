import mongoose from 'mongoose'
import Weapon from './weapon.js'

const Schema = mongoose.Schema
const weaponLvStatsSchema = new Schema({
  weaponId: { type: Schema.Types.ObjectId, ref: 'Weapon' },
  ascensionPhase: { type: Number, required: true },
  lowLv: { type: Number, required: true },
  highLv: { type: Number, required: true },
  lowAtk: { type: Number, required: true },
  highAtk: { type: Number, required: true },
  lowSecondStat: { type: String, required: true },
  highSecondStat: { type: String, required: true },
})

weaponLvStatsSchema.post('remove', async (doc) => {
  await Weapon.updateOne({ _id: doc.weaponId }, { $pull: { weaponLvStats: { $in: [doc._id] } } })
})

export default mongoose.model('WeaponLvStats', weaponLvStatsSchema)
