require("dotenv").config(); //โหลดตัวแปรแวดล้อม (.env) ป้องกันการ hard-code ข้อมูลสำคัญในโค้ด
const express = require("express");
const cors = require("cors"); //  อนุญาตให้โดเมนอื่นเข้าถึง API (จำเป็นสำหรับ Frontend ที่อยู่คนละโดเมน)
const morgan = require("morgan"); // เป็น Logger ช่วยบันทึกการ request เช่น GET /funds 200 12ms
const handleErrors = require("./middlewares/error"); //  จัดการข้อผิดพลาดทั่วระบบ
const notFound = require("./middlewares/not-found");
const authRoute = require("./routes/auth-route");
const wishlistRoute = require("./routes/wishlist-routes");
const fundRoute = require("./routes/fund-route");
const adminRoute = require("./routes/admin-route");
const userRoute = require("./routes/user-route");
const riskRoute = require("./routes/risk-assessment-route");
const aiRoute = require("./routes/ai-route");

const app = express();

// Middlewares
app.use(express.json()); //  แปลงข้อมูลที่รับมาเป็น JSON (ใช้กับ API ที่ส่งข้อมูลแบบ JSON)
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api", authRoute);
app.use("/wishlist", wishlistRoute);
app.use("/funds", fundRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/risk-assessment", riskRoute);
app.use("/ai", aiRoute);


// error middlewares
app.use(handleErrors); //ควรอยู่หลังสุด เพราะมันต้องรับข้อผิดพลาดจากทุกเส้นทาง (Route)
app.use(notFound)


const port = 8000; 
app.listen(port, () => console.log(`Server is running on port ${port}`)); //เริ่มต้นเซิร์ฟเวอร์ ของ Express.js และทำให้แอปพลิเคชันสามารถรับคำขอ (requests) จากผู้ใช้ที่เข้ามาผ่านพอร์ตที่กำหนด