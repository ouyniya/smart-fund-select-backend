const axios = require("axios");
const express = require("express");
const router = express.Router();
const OpenAI = require("openai")

// const userPortfolio = [
//     { asset: "กองทุน1", weight: 0.2, assetType: "ตราสารหนี้" },
//     { asset: "กองทุน2", weight: 0.3, assetType: "ตราสารทุน" },
//     { asset: "กองทุน3", weight: 0.5, assetType: "ตราสารทุน" },
// ];

// const recommendedPortfolio = [
//     { weight: 0.5, assetType: "ตราสารหนี้" },
//     { weight: 0.5, assetType: "ตราสารทุน" },
// ];

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // ใช้ OpenAI แทน
  });

async function analyzePortfolio(userPortfolio, recommendedPortfolio) {
  const prompt = `
    พอร์ตของผู้ใช้:
    ${JSON.stringify(userPortfolio, null, 2)}
    
    พอร์ตตัวอย่างที่แนะนำ:
    ${JSON.stringify(recommendedPortfolio, null, 2)}
    
    ช่วยวิเคราะห์ว่า:
    - พอร์ตของผู้ใช้ต่างจากพอร์ตแนะนำอย่างไร
    - ควรปรับพอร์ตอย่างไรให้เหมาะสม
    - ความเสี่ยงของพอร์ตปัจจุบัน
    `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o-mini",
  });

  return completion.choices[0].message.content;
}

router.post("/", async (req, res, next) => {
  try {
    const { userPortfolio, recommendedPortfolio } = req.body;
    const analysis = await analyzePortfolio(
      userPortfolio,
      recommendedPortfolio
    );
    res.json({ analysis });
  } catch (error) {
    next(error);
  }
});

router.post("/generate", async (req, res) => {
  try {
    const { userPortfolio, recommendCriteria } = req.body;

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

const prompt = `I am at a moderate risk level (userRiskLevelId = 4). I currently invest according to ${JSON.stringify(userPortfolio, null, 2)}, but my financial adviser told me to adjust port in order to align with ${JSON.stringify(recommendCriteria, null, 2)}. Could you please provide a brief analysis of this situation? Only one paragraph, please. Thanks.`

    console.log("Generated Prompt:", prompt);  // ตรวจสอบค่า prompt ที่ส่งไป

    const response = await axios.post("http://localhost:11434/api/generate", 
        {
            "model": "deepseek-r1:7b", //any models pulled from Ollama can be replaced here
            "prompt": prompt, //The prompt should be written here
            "stream": false,
            "prompt_eval_count": 10
          }
        )

    console.log("Full Response:", response);  // ตรวจสอบข้อมูลที่กลับมา

    if (response.data) {
      return res.json({ analysis: response.data });
    } else {
      return res.status(500).json({ error: "No valid response from API" });
    }
  } catch (error) {
    console.error("API Request Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

