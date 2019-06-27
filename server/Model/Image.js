const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const Joi = require("joi");

const ImageSchema = new Scheme({
  Track: {
    type: Array,
    required: true
  },
  Image: {
    type: String,
    required: true
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
function validateImage(obj) {
  const schema = {
    track: Joi.array().required(),
    image: Joi.string().required(),
    click: Joi.number().required()
  };
  return Joi.validate(obj, schema);
}
const Image = mongoose.model("prendi", ImageSchema);
module.exports = { Image, validateImage };
