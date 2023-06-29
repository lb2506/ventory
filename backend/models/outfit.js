const mongoose = require("mongoose");

const outfitSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  season: {
    type: String,
    required: false,
  },
  tags: {
    type: String,
    required: false,
  },
  vetements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Clothe" }],
});

const Outfit = mongoose.model("Outfit", outfitSchema);

module.exports = Outfit;
