import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

import weaponRouter from './routes/weapon.js'
import materialRouter from './routes/material.js'
import adminRouter from './routes/admin.js'
import eventRouter from './routes/event.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.set('views', path.join(dirname(fileURLToPath(import.meta.url)), '/views'))
app.set('view engine', 'ejs')

app.use('/api/weapon', weaponRouter)
app.use('/api/material', materialRouter)
app.use('/api/admin', adminRouter)
app.use('/api/event', eventRouter)

app.get('/', (req, res) => {
  res.status(200).json({ text: 'hello' })
})

export default app
