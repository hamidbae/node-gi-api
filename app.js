const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv/config')

const artifactRoute = require('./routes/artifact')
const weaponRoute = require('./routes/weapon')
const elementRoute = require('./routes/element')
const characterRoute = require('./routes/character')
const materialRoute = require('./routes/material')

const app = express()
const port = 5010

app.use(express.json())

app.use('/artifact', artifactRoute)
app.use('/weapon', weaponRoute)
app.use('/element', elementRoute)
app.use('/character', characterRoute)
app.use('/material', materialRoute)

app.get('/', (req, res) => {
    res.send('hello')
})

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
    app.listen(port, () => {
        console.log('This app running on http://localhost:' + port)
    })
})