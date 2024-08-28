const multer = require('multer');
const path = require('path');


// Upload Image Controller

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads'); // Set the upload destination path
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  // Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    }
  }).single('uploadImage'); // 'image' is the field name in the form

  // Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }

  exports.uploadImage = (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).send({ message: err });
      }
      if (!req.file) {
        return res.status(400).send({ message: "No file uploaded!" });
      }
      res.status(200).send({
        message: "File uploaded successfully!",
        file: req.file
      });
    });
  };