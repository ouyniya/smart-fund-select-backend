require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const handleErrors = require("./middlewares/error");
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
app.use(express.json());
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
app.use(handleErrors);
app.use(notFound)


const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));