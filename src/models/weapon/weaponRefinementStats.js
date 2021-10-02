import mongoose from 'mongoose'
import Weapon from './weapon.js'

const Schema = mongoose.Schema
const weaponRefinementStatsSchema = new Schema({
  weaponId: { type: Schema.Types.ObjectId, ref: 'Weapon' },
  refinementLv: { type: Number, required: true },
  statsTitle: { type: String, required: true },
  statsDescription: { type: String, required: true },
  cost: { type: Number, required: true },
})

weaponRefinementStatsSchema.post('remove', async (doc) => {
  await Weapon.updateOne({ _id: doc.weaponId }, { $pull: { refinementStats: { $in: [doc._id] } } })
})

export default mongoose.model('WeaponRefinementStats', weaponRefinementStatsSchema)
