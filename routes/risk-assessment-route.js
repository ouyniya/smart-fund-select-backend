const express = require("express")
const router = express.Router()
const riskAssessmentController = require("../controllers/risk-assessment-controller")

// path
router.get("/question", riskAssessmentController.getQuestions)
router.get("/result", riskAssessmentController.getResult)

module.exports = router