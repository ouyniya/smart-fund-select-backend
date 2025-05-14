const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = prisma;

// ตั้งค่าการเชื่อมต่อกับ Prisma Client ซึ่งเป็น ORM (Object-Relational Mapping) สำหรับ Node.js ที่ใช้เชื่อมต่อและจัดการฐานข้อมูลแบบง่าย ๆ
// @prisma/client เป็นไลบรารีที่ช่วยให้สามารถสื่อสารกับฐานข้อมูลที่กำหนดไว้ใน Prisma Schema (schema.prisma)