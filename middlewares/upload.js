const multer = require("multer"); // multer Middleware ใช้สำหรับจัดการการอัปโหลดไฟล์

// Only image files are allowed
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); //อนุญาตให้อัปโหลด
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  dest: "upload/", // กำหนดโฟลเดอร์ที่ใช้เก็บไฟล์ที่อัปโหลด
  fileFilter, // fileFilter → ใช้ฟังก์ชัน fileFilter เพื่อตรวจสอบประเภทไฟล์
  limits: { fileSize: 5 * 1024 * 1024 },
});
// จำกัดขนาดไฟล์ที่ 5MB

module.exports = upload;
