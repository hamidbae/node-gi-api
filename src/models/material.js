import mongoose from "mongoose";
import cloudinaryAPI from "../helper/cloudinary.js";

const Schema = mongoose.Schema;
const materialSchema = new Schema({
  name: { type: String, required: true },
  rarity: { type: Number, required: true },
  type: { type: String, required: true },
  imageUrl: {
    type: String,
    default:
      "https://static.wikia.nocookie.net/gensin-impact/images/7/77/Item_Dead_Ley_Line_Branch.png/revision/latest/scale-to-width-down/256?cb=20210106071133",
  },
  imageId: String,
  iconUrl: {
    type: String,
    default:
      "https://static.wikia.nocookie.net/gensin-impact/images/7/77/Item_Dead_Ley_Line_Branch.png/revision/latest/scale-to-width-down/74?cb=20210106071133",
  },
  iconId: String,
  obtain: [{ type: String, required: true }],
});

materialSchema.post("remove", async (doc) => {
  if (doc.imageId) {
    await cloudinaryAPI.deleteImage(doc.imageId);
  }

  if (doc.iconId) {
    await cloudinaryAPI.deleteImage(doc.iconId);
  }
});

export default mongoose.model("Material", materialSchema);
