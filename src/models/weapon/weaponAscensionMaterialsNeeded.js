import mongoose from 'mongoose'
import Weapon from './weapon.js'

const Schema = mongoose.Schema
const weaponAscensionMaterialsNeededSchema = new Schema({
  weaponId: { type: Schema.Types.ObjectId, ref: 'Weapon' },
  ascensionPhaseTo: { type: Number, required: true },
  cost: { type: String, required: true },
  weaponMaterialId: { type: Schema.Types.ObjectId, ref: 'Material' },
  weaponMaterialTotal: { type: Number, required: true },
  commonMaterial1Id: { type: Schema.Types.ObjectId, ref: 'Material' },
  commonMaterial1Total: { type: Number, required: true },
  commonMaterial2Id: { type: Schema.Types.ObjectId, ref: 'Material' },
  commonMaterial2Total: { type: Number, required: true },
})

weaponAscensionMaterialsNeededSchema.post('remove', async (doc) => {
  await Weapon.updateOne({ _id: doc.weaponId }, { $pull: { ascensionMaterials: { $in: [doc._id] } } })
})

export default mongoose.model('WeaponAscensionMaterialsNeeded', weaponAscensionMaterialsNeededSchema)
