const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const userController = require("../controllers/user-controller");
const authenticate = require("../middlewares/authenticate");

// all users can use these paths (i.e., admin, users)
router.get("/profile", authenticate, userController.getUser);
router.put(
  "/profile",
  authenticate,
  upload.single("profile"),
  userController.changeProfile
);
router.delete("/profile", authenticate, userController.deleteProfile);
router.post("/risk-assessment", authenticate, userController.saveRiskLevel);

module.exports = router;
