import app from './app.js'
import http from 'http'
import CONSTANT from './helper/constant.js'
import mongoose from 'mongoose'

const server = http.createServer(app)

mongoose
  .connect(CONSTANT.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    server.listen(CONSTANT.PORT, () => {
      console.log('This app running on http://localhost:' + CONSTANT.PORT)
    })
  })
