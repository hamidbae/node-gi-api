import test from 'ava'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import bcryptjs from 'bcryptjs'

// Your server and models
import app from '../app.js'
import Event from '../models/event.js'
import Admin from '../models/admin/admin.js'
import Material from '../models/material.js'
import Weapon from '../models/weapon/weapon.js'
import WeaponLvStats from '../models/weapon/weaponLvStats.js'
import WeaponRefinementStats from '../models/weapon/weaponRefinementStats.js'
import WeaponAscensionMaterialsNeeded from '../models/weapon/weaponAscensionMaterialsNeeded.js'

const mongod = await MongoMemoryServer.create()
const __dirname = dirname(fileURLToPath(import.meta.url))

let jwtToken = ''
let weaponId = ''
let commonMaterial1Id = ''
let commonMaterial2Id = ''
let weaponMaterialId = ''

// Create connection to Mongoose before tests are run
test.before(async () => {
  const uri = mongod.getUri()
  await mongoose.connect(uri)
})

// before
// register user
test.serial.before(async (t) => {
  const admin = new Admin({
    email: 'hamid1bae1@gmail.com',
    password: await bcryptjs.hash('password', 10),
  })

  const newAdmin = await admin.save()

  t.truthy(newAdmin._id)
  t.deepEqual(newAdmin.email, 'hamid1bae1@gmail.com')
  t.truthy(newAdmin.password)
})

test.after(() => Event.deleteMany({}))
test.after(() => Admin.deleteMany({}))
test.after(() => Material.deleteMany({}))
test.after(() => Weapon.deleteMany({}))
test.after(() => WeaponLvStats.deleteMany({}))

test.after.always(async () => {
  mongoose.disconnect()
  mongod.stop()
})

// login admin

test.serial('Login admin', async (t) => {
  const res = await request(app).post('/api/admin/login').send({
    email: 'hamid1bae1@gmail.com',
    password: 'password',
  })

  jwtToken = res.body.data.token

  t.is(res.status, 200)
  t.truthy(res.body.data.token)
  t.deepEqual(res.body.message, 'Login success')
})

// create event with image and auth
test.serial('Create event', async (t) => {
  const res = await request(app)
    .post('/api/event')
    .set('Authorization', 'Bearer ' + jwtToken)
    .field('title', 'title')
    .field('description', 'description')
    .field('status', 'ongoing')
    .field('startDate', 'Fri Oct 15 2021 23:59:00 GMT+0700 (Indochina Time)')
    .field('endDate', 'Sun Oct 17 2021 23:59:00 GMT+0700 (Indochina Time)')
    .attach('image', path.join(__dirname, 'image.png'))
    .attach('icon', path.join(__dirname, 'image.png'))

  t.is(res.status, 200)
  t.is(res.body.message, 'Add event success')
  t.is(res.body.data.title, 'title')
  t.is(res.body.data.description, 'description')
  t.is(res.body.data.status, 'ongoing')
  t.is(res.body.data.startDate, 'Fri Oct 15 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.is(res.body.data.endDate, 'Sun Oct 17 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.truthy(res.body.data._id)
  t.truthy(res.body.data.imageUrl)
  t.truthy(res.body.data.imageId)
  t.truthy(res.body.data.iconUrl)
  t.truthy(res.body.data.iconId)

  // Verify that event is created in DB
  const newEvent = await Event.findOne({ title: 'title' })
  t.is(newEvent.title, 'title')
  t.is(newEvent.description, 'description')
  t.is(newEvent.status, 'ongoing')
  t.is(newEvent.startDate, 'Fri Oct 15 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.is(newEvent.endDate, 'Sun Oct 17 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.truthy(newEvent._id)
  t.truthy(newEvent.imageUrl)
  t.truthy(newEvent.imageId)
  t.truthy(newEvent.iconUrl)
  t.truthy(newEvent.iconId)
})

// normal
// get all event
test.serial('Get events', async (t) => {
  const res = await request(app).get('/api/event')

  t.is(res.status, 200)
  t.true(Array.isArray(res.body.data))
  t.true(typeof res.body.data === 'object')
  t.is(res.body.message, 'Get events success')
  t.is(res.body.data[0].title, 'title')
  t.is(res.body.data[0].description, 'description')
  t.is(res.body.data[0].status, 'ongoing')
  t.is(res.body.data[0].startDate, 'Fri Oct 15 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.is(res.body.data[0].endDate, 'Sun Oct 17 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.truthy(res.body.data[0]._id)
  t.truthy(res.body.data[0].imageUrl)
  t.truthy(res.body.data[0].imageId)
  t.truthy(res.body.data[0].iconUrl)
  t.truthy(res.body.data[0].iconId)
})

// get one event
test.serial('Get event', async (t) => {
  const resEvents = await Event.findOne({ title: 'title' })

  const res = await request(app).get('/api/event/' + resEvents._id)

  t.is(res.status, 200)
  t.true(typeof res.body.data === 'object')
  t.is(res.body.message, 'Get event success')
  t.is(res.body.data.title, 'title')
  t.is(res.body.data.description, 'description')
  t.is(res.body.data.status, 'ongoing')
  t.is(res.body.data.startDate, 'Fri Oct 15 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.is(res.body.data.endDate, 'Sun Oct 17 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.truthy(res.body.data._id)
  t.truthy(res.body.data.imageUrl)
  t.truthy(res.body.data.imageId)
  t.truthy(res.body.data.iconUrl)
  t.truthy(res.body.data.iconId)
})

// update event with image and auth
test.serial('Update event', async (t) => {
  const resEvents = await Event.findOne({ title: 'title' })

  const res = await request(app)
    .put('/api/event/' + resEvents._id)
    .set('Authorization', 'Bearer ' + jwtToken)
    .field('title', 'update title')
    .field('description', 'update description')
    .field('status', 'done')
    .field('startDate', 'Sat Oct 16 2021 23:59:00 GMT+0700 (Indochina Time)')
    .field('endDate', 'Mon Oct 18 2021 23:59:00 GMT+0700 (Indochina Time)')
    .attach('image', path.join(__dirname, 'image.png'))
    .attach('icon', path.join(__dirname, 'image.png'))

  t.is(res.status, 200)
  t.is(res.body.message, 'Update event success')
  t.is(res.body.data.title, 'update title')
  t.is(res.body.data.description, 'update description')
  t.is(res.body.data.status, 'done')
  t.is(res.body.data.startDate, 'Sat Oct 16 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.is(res.body.data.endDate, 'Mon Oct 18 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.truthy(res.body.data._id)
  t.truthy(res.body.data.imageUrl)
  t.truthy(res.body.data.imageId)
  t.truthy(res.body.data.iconUrl)
  t.truthy(res.body.data.iconId)

  const updatedEvent = await Event.findOne({ title: 'update title' })
  t.is(updatedEvent.title, 'update title')
  t.is(updatedEvent.description, 'update description')
  t.is(updatedEvent.status, 'done')
  t.is(updatedEvent.startDate, 'Sat Oct 16 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.is(updatedEvent.endDate, 'Mon Oct 18 2021 23:59:00 GMT+0700 (Indochina Time)')
  t.truthy(updatedEvent._id)
  t.truthy(updatedEvent.imageUrl)
  t.truthy(updatedEvent.imageId)
  t.truthy(updatedEvent.iconUrl)
  t.truthy(updatedEvent.iconId)
})

// delete event with image and auth
test.serial('Delete event', async (t) => {
  const resEvents = await Event.findOne({ title: 'update title' })

  const res = await request(app)
    .delete('/api/event/' + resEvents._id)
    .set('Authorization', 'Bearer ' + jwtToken)

  t.is(res.status, 200)
  t.is(res.body.message, 'Delete event success')
  t.truthy(res.body.data.eventId)
})

// material
// unit
// testing

// create material with image and auth
test.serial('Create common material 1', async (t) => {
  const res = await request(app)
    .post('/api/material')
    .set('Authorization', 'Bearer ' + jwtToken)
    .field('name', 'Slime Condensate')
    .field('rarity', 1)
    .field('type', 'Common Ascension Material')
    .field('obtain', 'Dropped by Slimes')
    .attach('image', path.join(__dirname, 'image.png'))
    .attach('icon', path.join(__dirname, 'image.png'))

  t.is(res.status, 200)
  t.is(res.body.message, 'Add material success')
  t.is(res.body.data.name, 'Slime Condensate')
  t.is(res.body.data.rarity, 1)
  t.is(res.body.data.type, 'Common Ascension Material')
  t.deepEqual(res.body.data.obtain, ['Dropped by Slimes'])
  t.truthy(res.body.data._id)
  t.truthy(res.body.data.imageUrl)
  t.truthy(res.body.data.imageId)
  t.truthy(res.body.data.iconUrl)
  t.truthy(res.body.data.iconId)

  commonMaterial1Id = res.body.data._id

  // Verify that material is created in DB
  const newMaterial = await Material.findOne({ name: 'Slime Condensate' })
  t.is(newMaterial.name, 'Slime Condensate')
  t.is(newMaterial.rarity, 1)
  t.is(newMaterial.type, 'Common Ascension Material')
  t.deepEqual(newMaterial.obtain, ['Dropped by Slimes'])
  t.truthy(newMaterial._id)
  t.truthy(newMaterial.imageUrl)
  t.truthy(newMaterial.imageId)
  t.truthy(newMaterial.iconUrl)
  t.truthy(newMaterial.iconId)
})

test.serial('Create common material 2', async (t) => {
  const res = await request(app)
    .post('/api/material')
    .set('Authorization', 'Bearer ' + jwtToken)
    .field('name', 'Dead Ley Line Branch')
    .field('rarity', 2)
    .field('type', 'Common Ascension Material')
    .field('obtain', 'Dropped by Abyss Mages')
    .attach('image', path.join(__dirname, 'image.png'))
    .attach('icon', path.join(__dirname, 'image.png'))

  t.is(res.status, 200)
  t.is(res.body.message, 'Add material success')
  t.is(res.body.data.name, 'Dead Ley Line Branch')
  t.is(res.body.data.rarity, 2)
  t.is(res.body.data.type, 'Common Ascension Material')
  t.deepEqual(res.body.data.obtain, ['Dropped by Abyss Mages'])
  t.truthy(res.body.data._id)
  t.truthy(res.body.data.imageUrl)
  t.truthy(res.body.data.imageId)
  t.truthy(res.body.data.iconUrl)
  t.truthy(res.body.data.iconId)

  commonMaterial2Id = res.body.data._id

  // Verify that material is created in DB
  const newMaterial = await Material.findOne({ name: 'Dead Ley Line Branch' })
  t.is(newMaterial.name, 'Dead Ley Line Branch')
  t.is(newMaterial.rarity, 2)
  t.is(newMaterial.type, 'Common Ascension Material')
  t.deepEqual(newMaterial.obtain, ['Dropped by Abyss Mages'])
  t.truthy(newMaterial._id)
  t.truthy(newMaterial.imageUrl)
  t.truthy(newMaterial.imageId)
  t.truthy(newMaterial.iconUrl)
  t.truthy(newMaterial.iconId)
})

test.serial('Create weapon material', async (t) => {
  const res = await request(app)
    .post('/api/material')
    .set('Authorization', 'Bearer ' + jwtToken)
    .field('name', 'Grain of Aerosiderite')
    .field('rarity', 2)
    .field('type', 'Weapon Ascension Materials')
    .field('obtain', 'Hidden Palace of Lianshan Formula')
    .attach('image', path.join(__dirname, 'image.png'))
    .attach('icon', path.join(__dirname, 'image.png'))

  t.is(res.status, 200)
  t.is(res.body.message, 'Add material success')
  t.is(res.body.data.name, 'Grain of Aerosiderite')
  t.is(res.body.data.rarity, 2)
  t.is(res.body.data.type, 'Weapon Ascension Materials')
  t.deepEqual(res.body.data.obtain, ['Hidden Palace of Lianshan Formula'])
  t.truthy(res.body.data._id)
  t.truthy(res.body.data.imageUrl)
  t.truthy(res.body.data.imageId)
  t.truthy(res.body.data.iconUrl)
  t.truthy(res.body.data.iconId)

  weaponMaterialId = res.body.data._id

  // Verify that material is created in DB
  const newMaterial = await Material.findOne({ name: 'Grain of Aerosiderite' })
  t.is(newMaterial.name, 'Grain of Aerosiderite')
  t.is(newMaterial.rarity, 2)
  t.is(newMaterial.type, 'Weapon Ascension Materials')
  t.deepEqual(newMaterial.obtain, ['Hidden Palace of Lianshan Formula'])
  t.truthy(newMaterial._id)
  t.truthy(newMaterial.imageUrl)
  t.truthy(newMaterial.imageId)
  t.truthy(newMaterial.iconUrl)
  t.truthy(newMaterial.iconId)
})

// normal
// get all material
test.serial('Get materials', async (t) => {
  const res = await request(app).get('/api/material')

  t.is(res.status, 200)
  t.true(Array.isArray(res.body.data))
  t.true(typeof res.body.data === 'object')
  t.is(res.body.message, 'Get materials success')
})

// get one material
test.serial('Get common material', async (t) => {
  const resMaterials = await Material.findOne({ name: 'Slime Condensate' })

  const res = await request(app).get('/api/material/' + resMaterials._id)

  t.is(res.status, 200)
  t.true(typeof res.body.data === 'object')
  t.is(res.body.message, 'Get material success')
  t.is(res.body.data.name, 'Slime Condensate')
  t.is(res.body.data.rarity, 1)
  t.is(res.body.data.type, 'Common Ascension Material')
  t.deepEqual(res.body.data.obtain, ['Dropped by Slimes'])
  t.truthy(res.body.data._id)
  t.truthy(res.body.data.imageUrl)
  t.truthy(res.body.data.imageId)
  t.truthy(res.body.data.iconUrl)
  t.truthy(res.body.data.iconId)
})

// update material with image and auth
test.serial('Update common material 1', async (t) => {
  const material = await Material.findOne({ name: 'Slime Condensate' })

  const res = await request(app)
    .put('/api/material/' + material._id)
    .set('Authorization', 'Bearer ' + jwtToken)
    .field('name', 'Slime Condensate Update')
    .field('rarity', 4)
    .field('type', 'Common Ascension Material Update')
    .field('obtain', 'Dropped by Slimes Update')
    .attach('image', path.join(__dirname, 'image.png'))
    .attach('icon', path.join(__dirname, 'image.png'))

  t.is(res.status, 200)
  t.is(res.body.message, 'Update material success')
  t.is(res.body.data.name, 'Slime Condensate Update')
  t.is(res.body.data.rarity, 4)
  t.is(res.body.data.type, 'Common Ascension Material Update')
  t.deepEqual(res.body.data.obtain, ['Dropped by Slimes Update'])
  t.truthy(res.body.data._id)
  t.truthy(res.body.data.imageUrl)
  t.truthy(res.body.data.imageId)
  t.truthy(res.body.data.iconUrl)
  t.truthy(res.body.data.iconId)

  const updatedMaterial = await Material.findOne({ name: 'Slime Condensate Update' })
  t.is(updatedMaterial.name, 'Slime Condensate Update')
  t.is(updatedMaterial.rarity, 4)
  t.is(updatedMaterial.type, 'Common Ascension Material Update')
  t.deepEqual(updatedMaterial.obtain, ['Dropped by Slimes Update'])
  t.truthy(updatedMaterial._id)
  t.truthy(updatedMaterial.imageUrl)
  t.truthy(updatedMaterial.imageId)
  t.truthy(updatedMaterial.iconUrl)
  t.truthy(updatedMaterial.iconId)
})

// weapon
// unit
// testing

// create weapon with image and auth

test.serial('Create weapon', async (t) => {
  const res = await request(app)
    .post('/api/weapon')
    .set('Authorization', 'Bearer ' + jwtToken)
    .field('name', 'Staff of Homa')
    .field('rarity', 5)
    .field('type', 'Polearm')
    .field('obtain', 'Weapon Event Wishes')
    .field('series', 'Liyue')
    .field('secondStat', 'Critical Damage')
    .attach('image1', path.join(__dirname, 'image.png'))
    .attach('image2', path.join(__dirname, 'image.png'))
    .attach('icon', path.join(__dirname, 'image.png'))

  t.is(res.status, 200)
  t.is(res.body.message, 'Add weapon success')
  t.is(res.body.data.name, 'Staff of Homa')
  t.is(res.body.data.rarity, 5)
  t.is(res.body.data.type, 'Polearm')
  t.is(res.body.data.obtain, 'Weapon Event Wishes')
  t.is(res.body.data.series, 'Liyue')
  t.is(res.body.data.secondStat, 'Critical Damage')
  t.truthy(res.body.data._id)
  t.truthy(res.body.data.image1Url)
  t.truthy(res.body.data.image1Id)
  t.truthy(res.body.data.image2Url)
  t.truthy(res.body.data.image2Id)
  t.truthy(res.body.data.iconUrl)
  t.truthy(res.body.data.iconId)

  weaponId = res.body.data._id

  // Verify that weapon is created in DB
  const newWeapon = await Weapon.findOne({ name: 'Staff of Homa' })
  t.is(newWeapon.name, 'Staff of Homa')
  t.is(newWeapon.rarity, 5)
  t.is(newWeapon.type, 'Polearm')
  t.is(newWeapon.obtain, 'Weapon Event Wishes')
  t.is(newWeapon.series, 'Liyue')
  t.is(newWeapon.secondStat, 'Critical Damage')
  t.truthy(newWeapon._id)
  t.truthy(newWeapon.image1Url)
  t.truthy(newWeapon.image1Id)
  t.truthy(newWeapon.image2Url)
  t.truthy(newWeapon.image2Id)
  t.truthy(newWeapon.iconUrl)
  t.truthy(newWeapon.iconId)
})

// normal
// get all weapon
test.serial('Get weapons', async (t) => {
  const res = await request(app).get('/api/weapon')

  t.is(res.status, 200)
  t.true(Array.isArray(res.body.data))
  t.true(typeof res.body.data === 'object')
  t.is(res.body.message, 'Get weapons success')
  t.is(res.body.data[0].name, 'Staff of Homa')
  t.is(res.body.data[0].rarity, 5)
  t.is(res.body.data[0].type, 'Polearm')
  t.is(res.body.data[0].obtain, 'Weapon Event Wishes')
  t.is(res.body.data[0].series, 'Liyue')
  t.is(res.body.data[0].secondStat, 'Critical Damage')
  t.truthy(res.body.data[0]._id)
  t.truthy(res.body.data[0].image1Url)
  t.truthy(res.body.data[0].image1Id)
  t.truthy(res.body.data[0].image2Url)
  t.truthy(res.body.data[0].image2Id)
  t.truthy(res.body.data[0].iconUrl)
  t.truthy(res.body.data[0].iconId)
})

// get one weapon
test.serial('Get weapon', async (t) => {
  const resWeapons = await request(app).get('/api/weapon')

  const res = await request(app).get('/api/weapon/detail/' + resWeapons.body.data[0]._id)

  t.is(res.status, 200)
  t.true(typeof res.body.data === 'object')
  t.is(res.body.message, 'Get weapon success')
  t.is(res.body.data.name, 'Staff of Homa')
  t.is(res.body.data.rarity, 5)
  t.is(res.body.data.type, 'Polearm')
  t.is(res.body.data.obtain, 'Weapon Event Wishes')
  t.is(res.body.data.series, 'Liyue')
  t.is(res.body.data.secondStat, 'Critical Damage')
  t.truthy(res.body.data._id)
  t.truthy(res.body.data.image1Url)
  t.truthy(res.body.data.image1Id)
  t.truthy(res.body.data.image2Url)
  t.truthy(res.body.data.image2Id)
  t.truthy(res.body.data.iconUrl)
  t.truthy(res.body.data.iconId)
})

// update weapon with image and auth
test.serial('Update weapon', async (t) => {
  const weapon = await Weapon.findOne({ name: 'Staff of Homa' })

  const res = await request(app)
    .put('/api/weapon/' + weapon._id)
    .set('Authorization', 'Bearer ' + jwtToken)
    .field('name', 'Staff of Homa Update')
    .field('rarity', 4)
    .field('type', 'Polearm Update')
    .field('obtain', 'Weapon Event Wishes Update')
    .field('series', 'Liyue Update')
    .field('secondStat', 'Critical Damage Update')
    .attach('image1', path.join(__dirname, 'image.png'))
    .attach('image2', path.join(__dirname, 'image.png'))
    .attach('icon', path.join(__dirname, 'image.png'))

  t.is(res.status, 200)
  t.is(res.body.message, 'Update weapon success')
  t.is(res.body.data.name, 'Staff of Homa Update')
  t.is(res.body.data.rarity, 4)
  t.is(res.body.data.type, 'Polearm Update')
  t.is(res.body.data.obtain, 'Weapon Event Wishes Update')
  t.is(res.body.data.series, 'Liyue Update')
  t.is(res.body.data.secondStat, 'Critical Damage Update')
  t.truthy(res.body.data._id)
  t.truthy(res.body.data.image1Url)
  t.truthy(res.body.data.image1Id)
  t.truthy(res.body.data.image2Url)
  t.truthy(res.body.data.image2Id)
  t.truthy(res.body.data.iconUrl)
  t.truthy(res.body.data.iconId)

  const updatedWeapon = await Weapon.findOne({ name: 'Staff of Homa Update' })
  t.is(updatedWeapon.name, 'Staff of Homa Update')
  t.is(updatedWeapon.rarity, 4)
  t.is(updatedWeapon.type, 'Polearm Update')
  t.is(updatedWeapon.obtain, 'Weapon Event Wishes Update')
  t.is(updatedWeapon.series, 'Liyue Update')
  t.is(updatedWeapon.secondStat, 'Critical Damage Update')
  t.truthy(updatedWeapon._id)
  t.truthy(updatedWeapon.image1Url)
  t.truthy(updatedWeapon.image1Id)
  t.truthy(updatedWeapon.image2Url)
  t.truthy(updatedWeapon.image2Id)
  t.truthy(updatedWeapon.iconUrl)
  t.truthy(updatedWeapon.iconId)
})

// weaponLevel
// unit
// testing

// create weapon level with image and auth
test.serial('Create weapon level', async (t) => {
  const res = await request(app)
    .post('/api/weapon/lv-statistic/')
    .set('Authorization', 'Bearer ' + jwtToken)
    .send({
      weaponId: weaponId,
      ascensionPhase: 0,
      lowLv: 2,
      highLv: 20,
      lowAtk: 46,
      highAtk: 122,
      lowSecondStat: '14.4%',
      highSecondStat: '25.4%',
    })

  t.is(res.status, 200)
  t.is(res.body.message, 'Add weapon level success')
  t.truthy(res.body.data._id)
  t.is(res.body.data.weaponId, weaponId)
  t.is(res.body.data.ascensionPhase, 0)
  t.is(res.body.data.lowLv, 2)
  t.is(res.body.data.highLv, 20)
  t.is(res.body.data.lowAtk, 46)
  t.is(res.body.data.highAtk, 122)
  t.is(res.body.data.lowSecondStat, '14.4%')
  t.is(res.body.data.highSecondStat, '25.4%')

  // Verify that weaponLevel is created in DB
  const newWeaponLevel = await WeaponLvStats.findOne({ weaponId })

  t.truthy(newWeaponLevel._id)
  t.is(newWeaponLevel.weaponId.toString(), weaponId)
  t.is(newWeaponLevel.ascensionPhase, 0)
  t.is(newWeaponLevel.lowLv, 2)
  t.is(newWeaponLevel.highLv, 20)
  t.is(newWeaponLevel.lowAtk, 46)
  t.is(newWeaponLevel.highAtk, 122)
  t.is(newWeaponLevel.lowSecondStat, '14.4%')
  t.is(newWeaponLevel.highSecondStat, '25.4%')
})

// normal
// get all weapon level
test.serial('Get weapon levels', async (t) => {
  const res = await request(app).get('/api/weapon/lv-statistic')

  t.is(res.status, 200)
  t.true(Array.isArray(res.body.data))
  t.true(typeof res.body.data === 'object')
  t.is(res.status, 200)
  t.is(res.body.message, 'Get weapon levels success')
  t.truthy(res.body.data[0]._id)
  t.is(res.body.data[0].weaponId, weaponId)
  t.is(res.body.data[0].ascensionPhase, 0)
  t.is(res.body.data[0].lowLv, 2)
  t.is(res.body.data[0].highLv, 20)
  t.is(res.body.data[0].lowAtk, 46)
  t.is(res.body.data[0].highAtk, 122)
  t.is(res.body.data[0].lowSecondStat, '14.4%')
  t.is(res.body.data[0].highSecondStat, '25.4%')
})

// update weapon level with image and auth
test.serial('Update weapon level', async (t) => {
  const resWeaponLevel = await WeaponLvStats.findOne({ weaponId })

  const res = await request(app)
    .put('/api/weapon/lv-statistic/' + resWeaponLevel._id)
    .set('Authorization', 'Bearer ' + jwtToken)
    .send({
      weaponId: weaponId,
      ascensionPhase: 1,
      lowLv: 20,
      highLv: 40,
      lowAtk: 56,
      highAtk: 222,
      lowSecondStat: '17.4%',
      highSecondStat: '29.4%',
    })

  t.is(res.status, 200)
  t.is(res.body.message, 'Update weapon level success')
  t.truthy(res.body.data._id)
  t.is(res.body.data.weaponId, weaponId)
  t.is(res.body.data.ascensionPhase, 1)
  t.is(res.body.data.lowLv, 20)
  t.is(res.body.data.highLv, 40)
  t.is(res.body.data.lowAtk, 56)
  t.is(res.body.data.highAtk, 222)
  t.is(res.body.data.lowSecondStat, '17.4%')
  t.is(res.body.data.highSecondStat, '29.4%')

  const updatedWeaponLevel = await WeaponLvStats.findOne({ weaponId })
  t.truthy(updatedWeaponLevel._id)
  t.is(updatedWeaponLevel.weaponId.toString(), weaponId)
  t.is(updatedWeaponLevel.ascensionPhase, 1)
  t.is(updatedWeaponLevel.lowLv, 20)
  t.is(updatedWeaponLevel.highLv, 40)
  t.is(updatedWeaponLevel.lowAtk, 56)
  t.is(updatedWeaponLevel.highAtk, 222)
  t.is(updatedWeaponLevel.lowSecondStat, '17.4%')
  t.is(updatedWeaponLevel.highSecondStat, '29.4%')
})

// delete weaponLevel with image and auth
test.serial('Delete weapon level', async (t) => {
  const resWeaponLevels = await request(app).get('/api/weapon/lv-statistic')

  const res = await request(app)
    .delete('/api/weapon/lv-statistic/' + resWeaponLevels.body.data[0]._id)
    .set('Authorization', 'Bearer ' + jwtToken)

  t.is(res.status, 200)
  t.is(res.body.message, 'Delete weapon level success')
  t.truthy(res.body.data.weaponLevelId)
})

// weapon refinement
// unit
// testing

// create weapon refinement with image and auth
test.serial('Create weapon refinement', async (t) => {
  const res = await request(app)
    .post('/api/weapon/refinement/')
    .set('Authorization', 'Bearer ' + jwtToken)
    .send({
      weaponId: weaponId,
      refinementLv: 1,
      cost: 2000,
      statsTitle: 'Reckless Cinnabar',
      statsDescription:
        "HP increased by <b>40%</b>. Additionally, provides an ATK Bonus based on <b>1.6%</b> of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional <b>1.8%</b> of Max HP.",
    })

  t.is(res.status, 200)
  t.is(res.body.message, 'Add weapon refinement success')
  t.true(typeof res.body.data === 'object')
  t.truthy(res.body.data._id)
  t.is(res.body.data.weaponId, weaponId)
  t.is(res.body.data.refinementLv, 1)
  t.is(res.body.data.cost, 2000)
  t.is(res.body.data.statsTitle, 'Reckless Cinnabar')
  t.is(
    res.body.data.statsDescription,
    "HP increased by <b>40%</b>. Additionally, provides an ATK Bonus based on <b>1.6%</b> of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional <b>1.8%</b> of Max HP."
  )

  // Verify that weapon refinement is created in DB
  const newWeaponRefinement = await WeaponRefinementStats.findOne({ weaponId })

  t.truthy(newWeaponRefinement._id)
  t.is(newWeaponRefinement.weaponId.toString(), weaponId)
  t.is(newWeaponRefinement.refinementLv, 1)
  t.is(newWeaponRefinement.cost, 2000)
  t.is(newWeaponRefinement.statsTitle, 'Reckless Cinnabar')
  t.is(
    newWeaponRefinement.statsDescription,
    "HP increased by <b>40%</b>. Additionally, provides an ATK Bonus based on <b>1.6%</b> of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional <b>1.8%</b> of Max HP."
  )
})

// normal
// get all weapon refinement
test.serial('Get weapon refinements', async (t) => {
  const res = await request(app).get('/api/weapon/refinement')

  t.is(res.status, 200)
  t.true(Array.isArray(res.body.data))
  t.true(typeof res.body.data === 'object')
  t.is(res.status, 200)
  t.is(res.body.message, 'Get weapon refinements success')
  t.truthy(res.body.data[0]._id)
  t.is(res.body.data[0].weaponId, weaponId)
  t.is(res.body.data[0].refinementLv, 1)
  t.is(res.body.data[0].cost, 2000)
  t.is(res.body.data[0].statsTitle, 'Reckless Cinnabar')
  t.is(
    res.body.data[0].statsDescription,
    "HP increased by <b>40%</b>. Additionally, provides an ATK Bonus based on <b>1.6%</b> of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional <b>1.8%</b> of Max HP."
  )
})

// update weapon refinement with image and auth
test.serial('Update weapon refinement', async (t) => {
  const resWeaponRefinement = await request(app).get('/api/weapon/refinement')

  const res = await request(app)
    .put('/api/weapon/refinement/' + resWeaponRefinement.body.data[0]._id)
    .set('Authorization', 'Bearer ' + jwtToken)
    .send({
      weaponId: weaponId,
      refinementLv: 2,
      cost: 5000,
      statsTitle: 'Reckless Cinnabar Update',
      statsDescription:
        "Update HP increased by <b>40%</b>. Additionally, provides an ATK Bonus based on <b>1.6%</b> of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional <b>1.8%</b> of Max HP.",
    })

  t.is(res.status, 200)
  t.is(res.body.message, 'Update weapon refinement success')
  t.true(typeof res.body.data === 'object')
  t.truthy(res.body.data._id)
  t.is(res.body.data.weaponId, weaponId)
  t.is(res.body.data.refinementLv, 2)
  t.is(res.body.data.cost, 5000)
  t.is(res.body.data.statsTitle, 'Reckless Cinnabar Update')
  t.is(
    res.body.data.statsDescription,
    "Update HP increased by <b>40%</b>. Additionally, provides an ATK Bonus based on <b>1.6%</b> of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional <b>1.8%</b> of Max HP."
  )

  const updatedWeaponRefinement = await WeaponRefinementStats.findOne({ statsTitle: 'Reckless Cinnabar Update' })
  t.truthy(updatedWeaponRefinement._id)
  t.is(updatedWeaponRefinement.weaponId.toString(), weaponId)
  t.is(updatedWeaponRefinement.refinementLv, 2)
  t.is(updatedWeaponRefinement.cost, 5000)
  t.is(updatedWeaponRefinement.statsTitle, 'Reckless Cinnabar Update')
  t.is(
    updatedWeaponRefinement.statsDescription,
    "Update HP increased by <b>40%</b>. Additionally, provides an ATK Bonus based on <b>1.6%</b> of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional <b>1.8%</b> of Max HP."
  )
})

// delete weaponRefinement with image and auth
test.serial('Delete weapon refinement', async (t) => {
  const resWeaponRefinements = await request(app).get('/api/weapon/refinement')

  const res = await request(app)
    .delete('/api/weapon/refinement/' + resWeaponRefinements.body.data[0]._id)
    .set('Authorization', 'Bearer ' + jwtToken)

  t.is(res.status, 200)
  t.is(res.body.message, 'Delete weapon refinement success')
  t.truthy(res.body.data.weaponRefinementId)
})

// weapon ascension material
// unit
// testing

// create weapon ascension material with image and auth
test.serial('Create weapon ascension material', async (t) => {
  const res = await request(app)
    .post('/api/weapon/ascension-materials/')
    .set('Authorization', 'Bearer ' + jwtToken)
    .send({
      weaponId: weaponId,
      ascensionPhaseTo: 6,
      cost: 7000,
      commonMaterial1Id: commonMaterial1Id,
      commonMaterial1Total: 7,
      commonMaterial2Id: commonMaterial2Id,
      commonMaterial2Total: 7,
      weaponMaterialId: weaponMaterialId,
      weaponMaterialTotal: 7,
    })

  t.is(res.status, 200)
  t.is(res.body.message, 'Add weapon ascension material success')
  t.true(typeof res.body.data === 'object')
  t.truthy(res.body.data._id)
  t.is(res.body.data.weaponId, weaponId)
  t.is(res.body.data.ascensionPhaseTo, 6)
  t.is(res.body.data.cost, '7000')
  t.is(res.body.data.commonMaterial1Id, commonMaterial1Id)
  t.is(res.body.data.commonMaterial1Total, 7)
  t.is(res.body.data.commonMaterial2Id, commonMaterial2Id)
  t.is(res.body.data.commonMaterial2Total, 7)
  t.is(res.body.data.weaponMaterialId, weaponMaterialId)
  t.is(res.body.data.weaponMaterialTotal, 7)

  // Verify that weapon ascensionMaterial is created in DB
  const newWeaponAscensionMaterial = await WeaponAscensionMaterialsNeeded.findOne({ weaponId })

  t.truthy(newWeaponAscensionMaterial._id)
  t.is(newWeaponAscensionMaterial.weaponId.toString(), weaponId)
  t.is(newWeaponAscensionMaterial.ascensionPhaseTo, 6)
  t.is(newWeaponAscensionMaterial.cost, '7000')
  t.is(newWeaponAscensionMaterial.commonMaterial1Id.toString(), commonMaterial1Id)
  t.is(newWeaponAscensionMaterial.commonMaterial1Total, 7)
  t.is(newWeaponAscensionMaterial.commonMaterial2Id.toString(), commonMaterial2Id)
  t.is(newWeaponAscensionMaterial.commonMaterial2Total, 7)
  t.is(newWeaponAscensionMaterial.weaponMaterialId.toString(), weaponMaterialId)
  t.is(newWeaponAscensionMaterial.weaponMaterialTotal, 7)
})

// normal
// get all weapon ascension material
test.serial('Get weapon ascension materials', async (t) => {
  const res = await request(app).get('/api/weapon/ascension-materials')

  t.is(res.status, 200)
  t.true(Array.isArray(res.body.data))
  t.true(typeof res.body.data === 'object')
  t.is(res.status, 200)
  t.is(res.body.message, 'Get weapon ascension materials success')
  t.truthy(res.body.data[0]._id)
  t.is(res.body.data[0].weaponId, weaponId)
  t.is(res.body.data[0].ascensionPhaseTo, 6)
  t.is(res.body.data[0].cost, '7000')
  t.is(res.body.data[0].commonMaterial1Id, commonMaterial1Id)
  t.is(res.body.data[0].commonMaterial1Total, 7)
  t.is(res.body.data[0].commonMaterial2Id, commonMaterial2Id)
  t.is(res.body.data[0].commonMaterial2Total, 7)
  t.is(res.body.data[0].weaponMaterialId, weaponMaterialId)
  t.is(res.body.data[0].weaponMaterialTotal, 7)
})

// update weapon ascension material with image and auth
test.serial('Update weapon ascension material', async (t) => {
  const resWeaponAscensionMaterial = await request(app).get('/api/weapon/ascension-materials')

  const res = await request(app)
    .put('/api/weapon/ascension-materials/' + resWeaponAscensionMaterial.body.data[0]._id)
    .set('Authorization', 'Bearer ' + jwtToken)
    .send({
      weaponId: weaponId,
      ascensionPhaseTo: 6,
      cost: 7000,
      commonMaterial1Id: commonMaterial1Id,
      commonMaterial1Total: 7,
      commonMaterial2Id: commonMaterial2Id,
      commonMaterial2Total: 7,
      weaponMaterialId: weaponMaterialId,
      weaponMaterialTotal: 7,
    })

  t.is(res.status, 200)
  t.is(res.body.message, 'Update weapon ascension material success')
  t.true(typeof res.body.data === 'object')
  t.truthy(res.body.data._id)
  t.is(res.body.data.weaponId, weaponId)
  t.is(res.body.data.ascensionPhaseTo, 6)
  t.is(res.body.data.cost, '7000')
  t.is(res.body.data.commonMaterial1Id, commonMaterial1Id)
  t.is(res.body.data.commonMaterial1Total, 7)
  t.is(res.body.data.commonMaterial2Id, commonMaterial2Id)
  t.is(res.body.data.commonMaterial2Total, 7)
  t.is(res.body.data.weaponMaterialId, weaponMaterialId)
  t.is(res.body.data.weaponMaterialTotal, 7)

  const updatedWeaponAscensionMaterial = await WeaponAscensionMaterialsNeeded.findOne({ weaponId })

  t.truthy(updatedWeaponAscensionMaterial._id)
  t.is(updatedWeaponAscensionMaterial.weaponId.toString(), weaponId)
  t.is(updatedWeaponAscensionMaterial.ascensionPhaseTo, 6)
  t.is(updatedWeaponAscensionMaterial.cost, '7000')
  t.is(updatedWeaponAscensionMaterial.commonMaterial1Id.toString(), commonMaterial1Id)
  t.is(updatedWeaponAscensionMaterial.commonMaterial1Total, 7)
  t.is(updatedWeaponAscensionMaterial.commonMaterial2Id.toString(), commonMaterial2Id)
  t.is(updatedWeaponAscensionMaterial.commonMaterial2Total, 7)
  t.is(updatedWeaponAscensionMaterial.weaponMaterialId.toString(), weaponMaterialId)
  t.is(updatedWeaponAscensionMaterial.weaponMaterialTotal, 7)
})

// delete weapon ascension material with image and auth
test.serial('Delete weapon ascension material', async (t) => {
  const resWeaponAscensionMaterials = await request(app).get('/api/weapon/ascension-materials')

  const res = await request(app)
    .delete('/api/weapon/ascension-materials/' + resWeaponAscensionMaterials.body.data[0]._id)
    .set('Authorization', 'Bearer ' + jwtToken)

  t.is(res.status, 200)
  t.is(res.body.message, 'Delete weapon ascension material success')
  t.truthy(res.body.data.weaponAscensionMaterialId)
})

// delete material with image and auth
test.serial('Delete material', async (t) => {
  const material = await Material.findOne({ name: 'Slime Condensate Update' })

  const res = await request(app)
    .delete('/api/material/' + material._id)
    .set('Authorization', 'Bearer ' + jwtToken)

  t.is(res.status, 200)
  t.is(res.body.message, 'Delete material success')
  t.truthy(res.body.data.materialId)
})

// delete weapon with image and auth
test.serial('Delete weapon', async (t) => {
  const weapon = await Weapon.findOne({ name: 'Staff of Homa Update' })

  const res = await request(app)
    .delete('/api/weapon/' + weapon._id)
    .set('Authorization', 'Bearer ' + jwtToken)

  t.is(res.status, 200)
  t.is(res.body.message, 'Delete weapon success')
  t.truthy(res.body.data.weaponId)
})
