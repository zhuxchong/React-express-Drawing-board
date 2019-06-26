const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
require("dotenv").config();

const imageRouter = require("./routes/image");

const app = express();

app.use(logger("dev"));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/image", imageRouter);

// catch 404 and forward to error handler
app.use(function(next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
  require("./utils/MongoConnect");
});

module.exports = app;
