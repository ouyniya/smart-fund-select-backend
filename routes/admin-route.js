const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const authenticate = require("../middlewares/authenticate");
const { validationZod, registerSchema } = require("../middlewares/validators");

router.get("/user-management", authenticate, adminController.getAllUsers);
router.post("/user-management", validationZod(registerSchema), authenticate, adminController.addUser);
router.put(
  "/user-management",
  authenticate,
  adminController.updateRole
);
router.delete(
  "/user-management/:userId",
  authenticate,
  adminController.deleteUser
);

module.exports = router;
