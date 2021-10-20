import mongoose from 'mongoose'
import cloudinaryAPI from '../helper/cloudinary.js'

const Schema = mongoose.Schema
const eventSchema = new Schema({
  title: { type: String, required: true },
  status: { type: String, required: true },
  description: { type: String, required: true },
  dateStart: { type: String, required: true },
  dateEnd: { type: String, required: true },
  imageId: { type: String, required: true },
  imageUrl: {
    type: String,
    default:
      'https://static.wikia.nocookie.net/gensin-impact/images/1/17/Weapon_Staff_of_Homa.png/revision/latest/scale-to-width-down/256?cb=20210225200935',
  },
})

eventSchema.post('remove', async (doc) => {
  if (doc.imageId) {
    await cloudinaryAPI.deleteImage(doc.imageId)
  }
})

export default mongoose.model('Event', eventSchema)
