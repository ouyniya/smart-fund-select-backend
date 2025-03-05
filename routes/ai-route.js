// const axios = require("axios");
const express = require("express");
const aiController = require("../controllers/ai-controller");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.get("/portfolio", authenticate, aiController.getUserPort)
router.post("/portfolio", authenticate, aiController.addUserPort)
router.delete("/portfolio/:userPortId", authenticate, aiController.deleteUserPort)
router.put("/portfolio/:userPortId", authenticate, aiController.updateUserPort)
router.post("/", aiController.getAnalysis)

// router.post("/generate", async (req, res) => {
//   try {
//     const { userPortfolio, recommendCriteria } = req.body;

    // if (!userPortfolio || !recommendedPortfolio) {
    //   return res.status(400).json({ error: "Data is required" });
    // }

//     const prompt = `
//       พอร์ตการลงทุนของผู้ใช้:
//       ${JSON.stringify(userPortfolio, null, 2)}
      
//       พอร์ตการลงทุนที่แนะนำ:
//       ${JSON.stringify(recommendedPortfolio, null, 2)}
      
// if i am a moderate risk level. I should invest like  พอร์ตการลงทุนที่แนะนำ but I invest in พอร์ตการลงทุนของผู้ใช้. Could you please analyze risk of my portfolio and the appropriate of my investment with my risk level.
//     `;

// const prompt = `I am at a moderate risk level (userRiskLevelId = 4). I currently invest according to ${JSON.stringify(userPortfolio, null, 2)}, but my financial adviser told me to adjust port in order to align with ${JSON.stringify(recommendCriteria, null, 2)}. As my financial adviser, could you  provide a concise summary to told me easily to understand in English?`

// const prompt = `I am at a moderate risk level (userRiskLevelId = 4). I currently invest according to ${JSON.stringify(userPortfolio, null, 2)}, but my financial adviser told me to adjust port in order to align with ${JSON.stringify(recommendCriteria, null, 2)}. Could you please provide a brief analysis of this situation? Only one paragraph, please. Thanks.`

//     console.log("Generated Prompt:", prompt);  // ตรวจสอบค่า prompt ที่ส่งไป

//     const response = await axios.post("http://localhost:11434/api/generate", 
//         {
//             "model": "deepseek-r1:7b", //any models pulled from Ollama can be replaced here
//             "prompt": prompt, //The prompt should be written here
//             "stream": false,
//             "prompt_eval_count": 10
//           }
//         )

//     console.log("Full Response:", response);  // ตรวจสอบข้อมูลที่กลับมา

//     if (response.data) {
//       return res.json({ analysis: response.data });
//     } else {
//       return res.status(500).json({ error: "No valid response from API" });
//     }
//   } catch (error) {
//     console.error("API Request Error:", error.message);
//     return res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;

