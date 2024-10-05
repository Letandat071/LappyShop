const mongoose = require('mongoose');

const isSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startlevel: {
        type: Number,
        required: true
    },
    endlevel: {
        type: Number,
        required: true
    },
    imageUrl: {  // Đổi 'image' thành 'imageUrl'
        type: String,
        required: true
    }
});

const IS = mongoose.model('IS', isSchema);

module.exports = IS;
