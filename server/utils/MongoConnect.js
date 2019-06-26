const mongoose = require("mongoose");
const bluebird = require("bluebird");
require("dotenv").config(); // to read value of process.env.MongoURI

// Get Mongoose to use the bluebird promise library
mongoose.Promise = bluebird;

mongoose
  .connect(process.env.MONGO_DB, { useNewUrlParser: true })
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.log(err));

module.exports = mongoose;
