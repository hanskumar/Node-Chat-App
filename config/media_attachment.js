const multer = require('multer');
const path   = require('path');


const storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/');
  },
  filename: function (req, file, callback) {

    var ext = path.extname(file.originalname);
    console.log(ext);
    callback(null, file.fieldname + '-' + Date.now()+ ext);
  }
});

exports.media_attachment = multer({storage: storage}).single('media_attachment');