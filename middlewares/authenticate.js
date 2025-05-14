// สำหรับตรวจสอบสิทธิ์ ซึ่งใช้ JWT (JSON Web Token) เพื่อตรวจสอบว่าผู้ใช้เข้าสู่ระบบถูกต้องหรือไม่ ก่อนที่จะอนุญาตให้เข้าถึง API ต่างๆ

const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma");

const authenticate = async (req, res, next) => {
  // ดึง Token จาก Header → "Bearer <token>"
  // ตรวจสอบว่ามี Token และอยู่ในรูปแบบที่ถูกต้อง
  // ถอดรหัส (jwt.verify) และดึงข้อมูล id ของผู้ใช้
  // เช็คว่ามีผู้ใช้ในฐานข้อมูลหรือไม่
  // ลบ password ออกจากข้อมูลผู้ใช้
  // เพิ่มข้อมูลผู้ใช้ (req.user) เข้าไปใน Request
  // API ที่ใช้ Middleware นี้สามารถเข้าถึง req.user ได้
  // เรียก next() เพื่อให้ API ดำเนินการต่อ

  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer")) {
      return createError(401, "unauthorized");
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return createError(401, "unauthorized");
    }

    const jwtPayload = jwt.verify(token, process.env.SECRET_KEY);

    const user = await prisma.user.findFirst({
      where: {
        id: jwtPayload.id,
      },
    });

    if (!user) {
      return createError(400, "User not found");
    }

    delete user.password;

    req.user = user; // send user obj { username, firstName, lastName, email, ... } within the request

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
