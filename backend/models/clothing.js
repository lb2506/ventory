const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    season: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

const Clothing = mongoose.model('Clothing', clothingSchema);

module.exports = Clothing;
