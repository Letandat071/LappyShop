const mongoose = require('mongoose');

const MapSchema = new mongoose.Schema({
    nameMap: {
        type: String,
        required: true
    },
    imageMap: {
        type: String,
        required: true
    },
    levels: [{
        type: String,
        required: true
    }]
});

const Map = mongoose.model('Map', MapSchema);

module.exports = Map;