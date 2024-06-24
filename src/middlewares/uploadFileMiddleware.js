const multer = require("multer");

exports.uploadFile = multer({ storage: multer.memoryStorage() });
