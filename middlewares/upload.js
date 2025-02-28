const multer = require("multer");

// Only image files are allowed
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  dest: "upload/",
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
// จำกัดขนาดไฟล์ที่ 5MB

module.exports = upload;
