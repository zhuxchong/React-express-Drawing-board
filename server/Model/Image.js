const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const ImageSchema = new Scheme({
  Track: {
    type: Array
  },
  Image: {
    type: String
  },

  Click: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

const Image = mongoose.model("prendi", ImageSchema);
module.exports = Image;
