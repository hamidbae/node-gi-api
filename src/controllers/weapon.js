import CONSTANT from '../helper/constant.js'
import moment from 'moment-timezone'
import RESPONSE from '../helper/response.js'
import LOGGER from '../helper/logger.js'
import cloudinaryAPI from '../helper/cloudinary.js'
import { validationResult } from 'express-validator'

import Weapon from '../models/weapon/weapon.js'
import WeaponAscensionMaterialsNeeded from '../models/weapon/weaponAscensionMaterialsNeeded.js'
import WeaponRefinementStats from '../models/weapon/weaponRefinementStats.js'
import WeaponLvStats from '../models/weapon/weaponLvStats.js'
import Material from '../models/material.js'

/*
weapon controller

fields:
  name
  type
  rarity
  obtain
  series
  image1Url
  image1Id
  image2Url
  image2Id
  iconUrl
  iconId
  weaponLvStats
  refinementStats
  ascensionMaterials
*/

const controller = {
  getAll: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
    try {
      const weapons = await Weapon.find()

      return res.status(200).json(RESPONSE(requestTime, 'Get weapons success', weapons))
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
      const { name, type, rarity, obtain, series, weaponLvStats, refinementStats, ascensionMaterials } = req.body
      const weapon = new Weapon({
        name,
        type,
        rarity,
        obtain,
        series,
        weaponLvStats,
        refinementStats,
        ascensionMaterials,
      })

      if (req.files) {
        const image1Path = req.files.image1[0].path
        const image2Path = req.files.image2[0].path
        const iconPath = req.files.icon[0].path
        const imageFolder = 'weapon/images'
        const iconFolder = 'weapon/icons'
        const image1 = await cloudinaryAPI.uploadImage(image1Path, imageFolder)
        const image2 = await cloudinaryAPI.uploadImage(image2Path, imageFolder)
        const icon = await cloudinaryAPI.uploadImage(iconPath, iconFolder)
        weapon.image1Url = image1.imageUrl
        weapon.image1Id = image1.imageId
        weapon.image2Url = image2.imageUrl
        weapon.image2Id = image2.imageId
        weapon.iconUrl = icon.imageUrl
        weapon.iconId = icon.imageId
      }

      const newWeapon = await weapon.save()

      return res.status(200).json(RESPONSE(requestTime, 'Add weapon success', newWeapon))
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
      const weaponId = req.params.id
      let { name, type, rarity, obtain, series, weaponLvStats, refinementStats, ascensionMaterials } = req.body
      const weapon = await Weapon.findById(weaponId)
      if (!weapon) {
        return res.status(404).json(RESPONSE(requestTime, 'Weapon not found!', null))
      }
      weapon.name = name ? name : weapon.name
      weapon.type = type ? type : weapon.type
      weapon.rarity = rarity ? rarity : weapon.rarity
      weapon.obtain = obtain ? obtain : weapon.obtain
      weapon.series = series ? series : weapon.series
      weapon.weaponLvStats = weaponLvStats ? weaponLvStats : weapon.weaponLvStats
      weapon.refinementStats = refinementStats ? refinementStats : weapon.refinementStats
      weapon.ascensionMaterials = ascensionMaterials ? ascensionMaterials : weapon.ascensionMaterials

      if (req.files.image1) {
        const imagePath = req.files.image1[0].path
        const imageFolder = 'weapon/images'
        if (weapon.image1Id) {
          await cloudinaryAPI.deleteImage(weapon.image1Id)
        }
        const newImage = await cloudinaryAPI.uploadImage(imagePath, imageFolder)
        weapon.image1Url = newImage.imageUrl
        weapon.image1Id = newImage.imageId
      }

      if (req.files.image2) {
        const imagePath = req.files.image2[0].path
        const imageFolder = 'weapon/images'
        if (weapon.image2Id) {
          await cloudinaryAPI.deleteImage(weapon.image2Id)
        }
        const newImage = await cloudinaryAPI.uploadImage(imagePath, imageFolder)
        weapon.image2Url = newImage.imageUrl
        weapon.image2Id = newImage.imageId
      }

      if (req.files.icon) {
        const iconPath = req.files.icon[0].path
        const iconFolder = 'weapon/icons'
        if (weapon.iconId) {
          await cloudinaryAPI.deleteImage(weapon.iconId)
        }
        const newIcon = await cloudinaryAPI.uploadImage(iconPath, iconFolder)
        weapon.iconUrl = newIcon.imageUrl
        weapon.iconId = newIcon.imageId
      }

      const updatedWeapon = await weapon.save()

      return res.status(200).json(RESPONSE(requestTime, 'Weapon updated', updatedWeapon))
    } catch (err) {
      LOGGER.Error(err)
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },

  del: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)

    try {
      const weaponId = req.params.id
      const weapon = await Weapon.findById(weaponId)
      if (!weapon) {
        return res.status(404).json(RESPONSE(requestTime, 'Weapon not found!', null))
      }

      await weapon.remove()

      return res.status(200).json(RESPONSE(requestTime, 'Delete weapon success', { weaponId }))
    } catch (err) {
      LOGGER.Error(err)
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
}

/*
weapon level statistic controller

fields:
  weaponId
  ascensionPhase
  lowLv
  highLv
  lowAtk
  highAtk
  lowSecondStat
  highSecondStat
*/

const levelController = {
  getAll: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
    try {
      const weaponLvStatistics = await WeaponLvStats.find()

      return res.status(200).json(RESPONSE(requestTime, 'Get list weapon refinement success', weaponLvStatistics))
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
      const { weaponId, ascensionPhase, lowLv, highLv, lowAtk, highAtk, lowSecondStat, highSecondStat } = req.body
      let weapon = await Weapon.findById(weaponId)
      if (!weapon) {
        return res.status(404).json(RESPONSE(requestTime, 'Weapon not found!', null))
      }
      const weaponLvStatistic = new WeaponLvStats({
        weaponId,
        ascensionPhase,
        lowLv,
        highLv,
        lowAtk,
        highAtk,
        lowSecondStat,
        highSecondStat,
      })

      const newWeaponLvStatistic = await weaponLvStatistic.save()
      weapon.weaponLvStats.push(newWeaponLvStatistic._id)
      await weapon.save()

      return res.status(200).json(RESPONSE(requestTime, 'Add weapon lav statistic success', newWeaponLvStatistic))
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
      const weaponLvStatisticId = req.params.id
      let { weaponId, ascensionPhase, lowLv, highLv, lowAtk, highAtk, lowSecondStat, highSecondStat } = req.body
      const weaponLvStatistic = await WeaponLvStats.findById(weaponLvStatisticId)
      if (!weaponLvStatistic) {
        return res.status(404).json(RESPONSE(requestTime, 'Weapon level statistic not found!', null))
      }

      if (weaponId) {
        const weapon = await Weapon.findById(weaponLvStatistic.weaponId)
        if (!weapon) {
          return res.status(404).json(RESPONSE(requestTime, 'Weapon not found!', null))
        }
        await Weapon.updateOne({ _id: weapon._id }, { $pull: { weaponLvStats: { $in: [weaponLvStatisticId] } } })

        const weaponUpdate = await Weapon.findById(weaponId)
        if (!weaponUpdate) {
          return res.status(404).json(RESPONSE(requestTime, 'Weapon not found!', null))
        }
        await Weapon.updateOne({ _id: weaponId }, { $push: { weaponLvStats: weaponLvStatisticId } })
      }

      weaponLvStatistic.weaponId = weaponId ? weaponId : weaponLvStatistic.weaponId
      weaponLvStatistic.ascensionPhase = ascensionPhase ? ascensionPhase : weaponLvStatistic.ascensionPhase
      weaponLvStatistic.lowLv = lowLv ? lowLv : weaponLvStatistic.lowLv
      weaponLvStatistic.highLv = highLv ? highLv : weaponLvStatistic.highLv
      weaponLvStatistic.lowAtk = lowAtk ? lowAtk : weaponLvStatistic.lowAtk
      weaponLvStatistic.highAtk = highAtk ? highAtk : weaponLvStatistic.highAtk
      weaponLvStatistic.lowSecondStat = lowSecondStat ? lowSecondStat : weaponLvStatistic.lowSecondStat
      weaponLvStatistic.highSecondStat = highSecondStat ? highSecondStat : weaponLvStatistic.highSecondStat

      const updatedWeaponLvStatistic = await weaponLvStatistic.save()

      return res.status(200).json(RESPONSE(requestTime, 'Refinement material updated', updatedWeaponLvStatistic))
    } catch (err) {
      LOGGER.Error(err)
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
  del: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)

    try {
      const weaponLvStatisticId = req.params.id
      const weaponLvStatistic = await WeaponLvStats.findById(weaponLvStatisticId)
      if (!weaponLvStatistic) {
        return res.status(404).json(RESPONSE(requestTime, 'Weapon lv statistic not found!', null))
      }

      await weaponLvStatistic.remove()

      return res.status(200).json(
        RESPONSE(requestTime, 'Delete weapon lv statistic success', {
          _id: weaponLvStatisticId,
        })
      )
    } catch (err) {
      LOGGER.Error(err)
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
}

/*
weapon refinement api

fields: 
  weaponId
  refinementLv
  statsTitle
  statsDescription
  cost
*/

const refinementController = {
  getAll: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
    try {
      const weaponRefinements = await WeaponRefinementStats.find()

      return res.status(200).json(RESPONSE(requestTime, 'Get list weapon refinement success', weaponRefinements))
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
      const { weaponId, refinementLv, cost, statsTitle, statsDescription } = req.body
      let weapon = await Weapon.findById(weaponId)
      if (!weapon) {
        return res.status(404).json(RESPONSE(requestTime, 'Weapon not found!', null))
      }
      const weaponRefinement = new WeaponRefinementStats({
        weaponId,
        refinementLv,
        cost,
        statsTitle,
        statsDescription,
      })

      const newWeaponRefinementStats = await weaponRefinement.save()
      weapon.refinementStats.push(newWeaponRefinementStats._id)
      await weapon.save()

      return res.status(200).json(RESPONSE(requestTime, 'Add weapon refinement stats success', newWeaponRefinementStats))
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
      const weaponRefinementId = req.params.id
      let { weaponId, refinementLv, cost, statsTitle, statsDescription } = req.body
      const weaponRefinement = await WeaponRefinementStats.findById(weaponRefinementId)
      if (!weaponRefinement) {
        return res.status(404).json(RESPONSE(requestTime, 'Weapon refinement stats not found!', null))
      }

      if (weaponId) {
        const weapon = await Weapon.findById(weaponRefinement.weaponId)
        if (!weapon) {
          return res.status(404).json(RESPONSE(requestTime, 'Weapon not found!', null))
        }
        await Weapon.updateOne({ _id: weapon._id }, { $pull: { refinementStats: { $in: [weaponRefinementId] } } })

        const weaponUpdate = await Weapon.findById(weaponId)
        if (!weaponUpdate) {
          return res.status(404).json(RESPONSE(requestTime, 'Weapon not found!', null))
        }
        await Weapon.updateOne({ _id: weaponId }, { $push: { refinementStats: weaponRefinementId } })
      }

      weaponRefinement.weaponId = weaponId ? weaponId : weaponRefinement.weaponId
      weaponRefinement.refinementLv = refinementLv ? refinementLv : weaponRefinement.refinementLv
      weaponRefinement.cost = cost ? cost : weaponRefinement.cost
      weaponRefinement.statsTitle = statsTitle ? statsTitle : weaponRefinement.statsTitle
      weaponRefinement.statsDescription = statsDescription ? statsDescription : weaponRefinement.statsDescription

      const updatedWeaponRefinement = await weaponRefinement.save()

      return res.status(200).json(RESPONSE(requestTime, 'Refinement material updated', updatedWeaponRefinement))
    } catch (err) {
      LOGGER.Error(err)
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
  del: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)

    try {
      const weaponRefinementId = req.params.id
      const weaponRefinement = await WeaponRefinementStats.findById(weaponRefinementId)
      if (!weaponRefinement) {
        return res.status(404).json(RESPONSE(requestTime, 'List material not found!', null))
      }

      await weaponRefinement.remove()

      return res.status(200).json(
        RESPONSE(requestTime, 'Delete weapon refinement success', {
          weaponRefinementId,
        })
      )
    } catch (err) {
      LOGGER.Error(err)
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
}

// list ascension materials api
const ascensionMaterialController = {
  getAll: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)
    try {
      const listMaterial = await WeaponAscensionMaterialsNeeded.find()

      return res.status(200).json(RESPONSE(requestTime, 'Get list material success', listMaterial))
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
      const {
        weaponId,
        ascensionPhaseTo,
        cost,
        weaponMaterialId,
        weaponMaterialTotal,
        commonMaterial1Id,
        commonMaterial1Total,
        commonMaterial2Id,
        commonMaterial2Total,
      } = req.body

      let weapon = await Weapon.findById(weaponId)
      if (!weapon) {
        return res.status(404).json(RESPONSE(requestTime, 'Weapon not found!', null))
      }
      let weaponMaterial = await Material.findById(weaponMaterialId)
      if (!weaponMaterial) {
        return res.status(404).json(RESPONSE(requestTime, 'Weapon material not found!', null))
      }
      let commonMaterial1 = await Material.findById(commonMaterial1Id)
      if (!commonMaterial1) {
        return res.status(404).json(RESPONSE(requestTime, 'Common material 1 not found!', null))
      }
      let commonMaterial2 = await Material.findById(commonMaterial2Id)
      if (!commonMaterial2) {
        return res.status(404).json(RESPONSE(requestTime, 'Common material 2 not found!', null))
      }

      const listMaterial = new WeaponAscensionMaterialsNeeded({
        weaponId,
        ascensionPhaseTo,
        cost,
        weaponMaterialId,
        weaponMaterialTotal,
        commonMaterial1Id,
        commonMaterial1Total,
        commonMaterial2Id,
        commonMaterial2Total,
      })

      const newListMaterial = await listMaterial.save()
      weapon.ascensionMaterials.push(newListMaterial._id)
      weapon.save()

      return res.status(200).json(RESPONSE(requestTime, 'Add weapon ascension material list success', newListMaterial))
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
      const listMaterialId = req.params.id
      let {
        weaponId,
        ascensionPhaseTo,
        cost,
        weaponMaterialId,
        weaponMaterialTotal,
        commonMaterial1Id,
        commonMaterial1Total,
        commonMaterial2Id,
        commonMaterial2Total,
      } = req.body

      const listMaterial = await WeaponAscensionMaterialsNeeded.findById(listMaterialId)
      if (!listMaterial) {
        return res.status(404).json(RESPONSE(requestTime, 'List material not found!', null))
      }

      if (weaponMaterialId) {
        let weaponMaterial = await Material.findById(weaponMaterialId)
        if (!weaponMaterial) {
          return res.status(404).json(RESPONSE(requestTime, 'Weapon material not found!', null))
        }
      }

      if (commonMaterial1Id) {
        let commonMaterial1 = await Material.findById(commonMaterial1Id)
        if (!commonMaterial1) {
          return res.status(404).json(RESPONSE(requestTime, 'Common material 1 not found!', null))
        }
      }

      if (commonMaterial2Id) {
        let commonMaterial2 = await Material.findById(commonMaterial2Id)
        if (!commonMaterial2) {
          return res.status(404).json(RESPONSE(requestTime, 'Common material 2 not found!', null))
        }
      }

      if (weaponId) {
        const weapon = await Weapon.findById(listMaterial.weaponId)
        if (!weapon) {
          return res.status(404).json(RESPONSE(requestTime, 'Weapon not found!', null))
        }
        await Weapon.updateOne({ _id: weapon._id }, { $pull: { ascensionMaterials: { $in: [listMaterialId] } } })

        const weaponUpdate = await Weapon.findById(weaponId)
        if (!weaponUpdate) {
          return res.status(404).json(RESPONSE(requestTime, 'Weapon not found!', null))
        }
        await Weapon.updateOne({ _id: weaponId }, { $push: { ascensionMaterials: listMaterialId } })
      }

      listMaterial.weaponId = weaponId ? weaponId : listMaterial.weaponId
      listMaterial.ascensionPhaseTo = ascensionPhaseTo ? ascensionPhaseTo : listMaterial.ascensionPhaseTo
      listMaterial.cost = cost ? cost : listMaterial.cost
      listMaterial.weaponMaterialId = weaponMaterialId ? weaponMaterialId : listMaterial.weaponMaterialId
      listMaterial.weaponMaterialTotal = weaponMaterialTotal ? weaponMaterialTotal : listMaterial.weaponMaterialTotal
      listMaterial.commonMaterial1Id = commonMaterial1Id ? commonMaterial1Id : listMaterial.commonMaterial1Id
      listMaterial.commonMaterial1Total = commonMaterial1Total ? commonMaterial1Total : listMaterial.commonMaterial1Total
      listMaterial.commonMaterial2Id = commonMaterial2Id ? commonMaterial2Id : listMaterial.commonMaterial2Id
      listMaterial.commonMaterial2Total = commonMaterial2Total ? commonMaterial2Total : listMaterial.commonMaterial2Total

      const updatedListMaterial = await listMaterial.save()

      return res.status(200).json(RESPONSE(requestTime, 'List material updated', updatedListMaterial))
    } catch (err) {
      LOGGER.Error(err)
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
  del: async (req, res) => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT)

    try {
      const ascensionMaterialId = req.params.id
      const ascensionMaterial = await WeaponAscensionMaterialsNeeded.findById(ascensionMaterialId)
      if (!ascensionMaterial) {
        return res.status(404).json(RESPONSE(requestTime, 'List material not found!', null))
      }

      await ascensionMaterial.remove()

      return res.status(200).json(
        RESPONSE(requestTime, 'Delete ascension material needed success', {
          _id: ascensionMaterialId,
        })
      )
    } catch (err) {
      LOGGER.Error(err)
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, err))
    }
  },
}

export default {
  controller,
  levelController,
  ascensionMaterialController,
  refinementController,
}
