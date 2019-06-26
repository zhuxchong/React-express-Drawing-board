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
    Track: Joi.array().required(),
    Image: Joi.string().required(),
    Click: Joi.number().required()
  };
  return Joi.validate(obj, schema);
}
const Image = mongoose.model("prendi", ImageSchema);
module.exports = { Image, validateImage };
