const Jimp = require('jimp');

const resizeImg = async (req, res, next) => {
  const { path: tempDir } = req.file;
  Jimp.read(tempDir)
    .then(img => {
      return img.resize(250, 250).write(tempDir);
    })
    .then(() => {
      next();
    })
    .catch(err => {
      next(err);
    });
};

module.exports = resizeImg;
