const { z } = require("zod"); // นำเข้า z จาก Zod เพื่อใช้สร้าง Schema สำหรับตรวจสอบข้อมูล

exports.registerSchema = z.object({
    email: z.string().email("Invalid email"),
    username: z.string().min(3, "username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

exports.loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
});


// -- Middleware สำหรับตรวจสอบข้อมูลที่รับเข้ามา
// รับ schema ที่ต้องการตรวจสอบ
// ใช้ schema.parse(req.body) ตรวจสอบข้อมูล
// ถ้าข้อมูลถูกต้อง ✅ → next() ให้ API ทำงานต่อ
// ถ้าข้อมูลผิด ❌ → สร้าง Error แล้วส่งต่อให้ next(mergeError)
// จัดการ Error ให้อ่านง่ายขึ้น
// รวมข้อความผิดพลาด (.errors.map()) ให้เป็นข้อความเดียว
// ใช้ next(mergeError) ส่งไปให้ Middleware จัดการ

exports.validationZod = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        console.log(error.errors)
        const errMsg = error.errors.map(el => el.path[0] + ':' + el.message).join(", ");
        const mergeError = new Error(errMsg);
        next(mergeError);
    }
};