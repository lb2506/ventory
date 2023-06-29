const mongoose = require('mongoose');

const clotheSchema = new mongoose.Schema({
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
    date: { 
        type: Date, 
        default: Date.now 
    },
});

const Clothe = mongoose.model('Clothe', clotheSchema);

module.exports = Clothe;
