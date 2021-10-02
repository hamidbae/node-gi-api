import mongoose from "mongoose";

const Schema = mongoose.Schema;
const rarityStarSchema = new Schema({
  rarity: { type: Number, required: true },
  imageUrl: {
    type: String,
    default:
      "https://static.wikia.nocookie.net/gensin-impact/images/2/2b/Icon_5_Stars.png/revision/latest/scale-to-width-down/129?cb=20201226100736",
  },
});

export default mongoose.model("RarityStar", rarityStarSchema);
