const express = require("express");
const authController = require("../controllers/auth-controller");
const { validationZod, loginSchema, registerSchema } = require("../middlewares/validators");
const router = express.Router();

// router.post("/register", validationZod(registerSchema), authController.register);
router.post("/login", validationZod(loginSchema), authController.login);

module.exports = router;