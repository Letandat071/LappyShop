const mongoose = require('mongoose');

const theSandSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  options: {
    fast: {
      type: Number,
      required: true,
    },
    slow: {
      type: Number,
      required: true,
    },
    extra: {
      type: Number,
      required: true,
    }
  }
});

const TheSand = mongoose.model('TheSand', theSandSchema);
module.exports = TheSand;
