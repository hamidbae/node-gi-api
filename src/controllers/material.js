import moment from 'moment-timezone'
import { validationResult } from 'express-validator'

import CONSTANT from '../helper/constant.js'
import RESPONSE from '../helper/response.js'
import LOGGER from '../helper/logger.js'
import cloudinaryAPI from '../helper/cloudinary.js'

import Material from '../models/material.js'

const controller = {
  getOne: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
    try {
      const { materialId } = req.params
      const item = await Material.findById(materialId)
      if (!item) {
        return res.status(404).json(RESPONSE(requestTime, 'Material not found!', null))
      }

      return res.status(200).json(RESPONSE(requestTime, 'Get material success', item))
    } catch (err) {
      LOGGER.Error(err)

      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
  getAll: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
    try {
      const items = await Material.find()

      return res.status(200).json(RESPONSE(requestTime, 'Get material success', items))
    } catch (err) {
      LOGGER.Error(err)

      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
  add: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement', null, errors.array()))
    }

    try {
      const { name, rarity, type, obtain } = req.body
      const item = new Material({
        name,
        rarity,
        type,
        obtain,
      })

      if (req.files) {
        // console.log(req.files)
        const imagePath = req.files.image[0].path
        const iconPath = req.files.icon[0].path
        const imageFolder = 'material/images'
        const iconFolder = 'material/icons'
        const image = await cloudinaryAPI.uploadImage(imagePath, imageFolder)
        const icon = await cloudinaryAPI.uploadImage(iconPath, iconFolder)
        item.imageUrl = image.imageUrl
        item.imageId = image.imageId
        item.iconUrl = icon.imageUrl
        item.iconId = icon.imageId
      }

      const newItem = await item.save()

      return res.status(200).json(RESPONSE(requestTime, 'Add material success', newItem))
    } catch (err) {
      LOGGER.Error(err)

      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
  update: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement', null, errors.array()))
    }

    try {
      const materialId = req.params.id
      let { name, type, rarity, obtain } = req.body
      const material = await Material.findById(materialId)
      if (!material) {
        return res.status(404).json(RESPONSE(requestTime, 'Material not found!', null))
      }

      material.name = name ? name : material.name
      material.type = type ? type : material.type
      material.rarity = rarity ? rarity : material.rarity
      material.obtain = obtain ? obtain : material.obtain

      if (req.files.image) {
        const imagePath = req.files.image[0].path
        const imageFolder = 'material/images'
        if (material.imageId) {
          await cloudinaryAPI.deleteImage(material.imageId)
        }
        const newImage = await cloudinaryAPI.uploadImage(imagePath, imageFolder)
        material.imageUrl = newImage.imageUrl
        material.imageId = newImage.imageId
      }

      if (req.files.icon) {
        const iconPath = req.files.icon[0].path
        const iconFolder = 'material/icons'
        if (material.iconId) {
          await cloudinaryAPI.deleteImage(material.iconId)
        }
        const newIcon = await cloudinaryAPI.uploadImage(iconPath, iconFolder)
        material.iconUrl = newIcon.imageUrl
        material.iconId = newIcon.imageId
      }

      const updatedMaterial = await material.save()

      return res.status(200).json(RESPONSE(requestTime, 'Common material updated', updatedMaterial))
    } catch (err) {
      LOGGER.Error(err)
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
  del: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)

    try {
      const materialId = req.params.id
      const material = await Material.findById(materialId)
      if (!material) {
        return res.status(404).json(RESPONSE(requestTime, 'Common material not found!', null))
      }

      await material.remove()

      return res.status(200).json(RESPONSE(requestTime, 'Delete material success', { materialId }))
    } catch (err) {
      LOGGER.Error(err)
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
}

export default { controller }
