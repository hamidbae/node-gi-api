import cloudinary from "cloudinary";
import CONSTANT from "./constant.js";
const cloudinaryV2 = cloudinary.v2;

// config api
cloudinaryV2.config({
  cloud_name: CONSTANT.CLOUDINARY_NAME,
  api_key: CONSTANT.CLOUDINARY_API_KEY,
  api_secret: CONSTANT.CLOUDINARY_API_SECRET,
});

// upload image
const uploadImage = async (pathFile, folder) => {
  const image = await cloudinaryV2.uploader.upload(pathFile, {
    resource_type: "image",
    folder: "genshin-api-images/" + folder,
    overwrite: true,
  });
  // console.log(image);
  const imageUrl = image.secure_url;
  const imageId = image.public_id;
  return { imageUrl, imageId };
};

const deleteImage = async (imageId) => {
  await cloudinaryV2.uploader.destroy(imageId);
  return;
};

const cloudinaryAPI = {
  uploadImage,
  deleteImage,
};

export default cloudinaryAPI;
