import mongoose from 'mongoose'
import cloudinaryAPI from '../../helper/cloudinary.js'

const Schema = mongoose.Schema
const weaponSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  rarity: { type: Number, required: true },
  obtain: { type: String, required: true },
  series: { type: String, required: true },
  image1Id: { type: String, required: true },
  image1Url: {
    type: String,
    default:
      'https://static.wikia.nocookie.net/gensin-impact/images/1/17/Weapon_Staff_of_Homa.png/revision/latest/scale-to-width-down/256?cb=20210225200935',
  },
  image2Id: { type: String, required: true },
  image2Url: {
    type: String,
    default:
      'https://static.wikia.nocookie.net/gensin-impact/images/e/ee/Weapon_Staff_of_Homa_2nd.png/revision/latest/scale-to-width-down/256?cb=20210321105014',
  },
  iconId: { type: String, required: true },
  iconUrl: {
    type: String,
    default:
      'https://static.wikia.nocookie.net/gensin-impact/images/1/17/Weapon_Staff_of_Homa.png/revision/latest/scale-to-width-down/50?cb=20210225200935',
  },
  weaponLvStats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'WeaponLvStats',
    },
  ],
  refinementStats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'RefinementStats',
    },
  ],
  ascensionMaterials: [
    {
      type: Schema.Types.ObjectId,
      ref: 'AscensionMaterials',
    },
  ],
})

weaponSchema.post('remove', async (doc) => {
  if (doc.image1Id) {
    await cloudinaryAPI.deleteImage(doc.image1Id)
  }

  if (doc.image2Id) {
    await cloudinaryAPI.deleteImage(doc.image2Id)
  }

  if (doc.iconId) {
    await cloudinaryAPI.deleteImage(doc.iconId)
  }
})

export default mongoose.model('Weapon', weaponSchema)
