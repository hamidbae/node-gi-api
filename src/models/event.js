import mongoose from 'mongoose'
import cloudinaryAPI from '../helper/cloudinary.js'

const Schema = mongoose.Schema
const eventSchema = new Schema({
  title: { type: String, required: true },
  status: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: String, default: '2021-10-15 00:00' },
  endDate: { type: String, default: '2021-10-22 23:59' },
  imageId: { type: String, required: true },
  imageUrl: {
    type: String,
    required: true,
  },
  iconId: { type: String, default: 'genshin-api-images/event/images/wejqmtanizyi0saflyt8' },
  iconUrl: {
    type: String,
    default: '"https://res.cloudinary.com/do7afnkue/image/upload/v1634711540/genshin-api-images/event/images/wejqmtanizyi0saflyt8.jpg"',
  },
})

eventSchema.post('remove', async (doc) => {
  if (doc.imageId) {
    await cloudinaryAPI.deleteImage(doc.imageId)
  }
  if (doc.iconId) {
    await cloudinaryAPI.deleteImage(doc.iconId)
  }
})

export default mongoose.model('Event', eventSchema)
