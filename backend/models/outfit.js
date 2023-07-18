const mongoose = require("mongoose");

const outfitSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  public_id: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  season: {
    type: String,
  },
  tags: {
    type: String,
  },
  vetements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Clothe" }],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Outfit = mongoose.model("Outfit", outfitSchema);

module.exports = Outfit;
