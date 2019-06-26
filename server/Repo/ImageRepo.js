const Image = require("../Model/Image");

async function updateImage(req) {
  const count = await Image.find({}).countDocuments();
  if (!count) {
    return await Image.create({
      Image: req.body.image,
      Click: req.body.click,
      Track: req.body.track,
      date: new Date()
    });
  } else if (count === 1) {
    return await Image.updateMany(
      {},
      {
        Image: req.body.image,
        Click: req.body.click,
        Track: req.body.track,
        date: new Date()
      }
    );
  } else {
    return false;
  }
}
module.exports = { updateImage };
