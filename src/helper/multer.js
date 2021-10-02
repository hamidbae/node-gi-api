import path from 'path'
import multer from 'multer'

const fileStorage = multer.diskStorage({})
const fileFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname)
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
    cb(new Error('File type is not supported!'), false)
    return
  }
  cb(null, true)
}

export default multer({ storage: fileStorage, fileFilter: fileFilter })
