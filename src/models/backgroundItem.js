import mongoose from "mongoose";

const Schema = mongoose.Schema;
const backgroundItemSchema = new Schema({
  rarity: { type: Number, required: true },
  imageUrl: {
    type: String,
    default:
      "https://static.wikia.nocookie.net/gensin-impact/images/7/77/Item_Dead_Ley_Line_Branch.png/revision/latest/scale-to-width-down/256?cb=20210106071133",
  },
});

export default mongoose.model("BackgroundItem", backgroundItemSchema);
