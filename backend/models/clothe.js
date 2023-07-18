const mongoose = require("mongoose");

const clotheSchema = new mongoose.Schema({
  brand: {
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
  image: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Clothe = mongoose.model("Clothe", clotheSchema);

module.exports = Clothe;
