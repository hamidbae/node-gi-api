import * as env from 'dotenv'
env.config()

const CONSTANT = {
  AUTHOR: 'Xxrey',
  WIB: 'Asia/Jakarta',
  DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  TOKEN_EXPIRY_SECOND: 60 * 60 * 2,
  PORT: process.env.NODE_ENV === 'production' ? process.env.PORT : 5000,
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  SECRET_KEY: process.env.SECRET_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  EMAIL_USER: process.env.EMAIL_USER || 'user@mail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'pass',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 465,
}

export default CONSTANT
