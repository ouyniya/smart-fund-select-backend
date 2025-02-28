const express = require("express")
const router = express.Router()
const fundController = require("../controllers/fund-controller");

router.get("/all-fund-names", fundController.getAllFundNames)
router.get("/all-company", fundController.getCompany)
router.get("/all-group", fundController.getFundGroup)
router.get("/all-risk-level", fundController.getRiskLevel)
router.get("/all-global-inv", fundController.getGlobalInv)
router.get("/filter", fundController.getFunds)
router.get("/sort", fundController.sortFunds)

module.exports = router;