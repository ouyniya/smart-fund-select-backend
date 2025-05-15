// const axios = require("axios");
const express = require("express");
const aiController = require("../controllers/ai-controller");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.get("/portfolio", authenticate, aiController.getUserPort)
router.post("/portfolio", authenticate, aiController.addUserPort)
router.delete("/portfolio/:userPortId", authenticate, aiController.deleteUserPort)
router.put("/portfolio/:userPortId", authenticate, aiController.updateUserPort)
router.post("/", authenticate, aiController.getAnalysis)

module.exports = router;

