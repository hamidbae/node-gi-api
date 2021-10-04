import mongoose from 'mongoose'

const Schema = mongoose.Schema

const oneTimeTokenSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
})

const OneTimeToken = mongoose.model('OneTimeToken', oneTimeTokenSchema)

export default OneTimeToken
