var express = require("express");
var router = express.Router();
const { Image, validateImage } = require("../Model/Image");
const { updateImage } = require("../Repo/ImageRepo");

router.put("/save", async (req, res) => {
  const { error } = validateImage(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (await updateImage(req)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});
router.get("/init", (req, res) => {
  Image.find({})
    .then(result => {
      res.send(result.length === 0 ? "Welcome" : result[0]);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});
router.delete("/delete", (req, res) => {
  Image.deleteMany({})
    .then(result => {
      res.send(result);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});
module.exports = router;
