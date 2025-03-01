const axios = require("axios");
const express = require("express");
const router = express.Router();

// const userPortfolio = [
//     { asset: "กองทุน1", weight: 0.2, assetType: "ตราสารหนี้" },
//     { asset: "กองทุน2", weight: 0.3, assetType: "ตราสารทุน" },
//     { asset: "กองทุน3", weight: 0.5, assetType: "ตราสารทุน" },
// ];

// const recommendedPortfolio = [
//     { weight: 0.5, assetType: "ตราสารหนี้" },
//     { weight: 0.5, assetType: "ตราสารทุน" },
// ];

// const openai = new OpenAI({
//   baseURL: "https://api.deepseek.com",
//   apiKey: process.env.DEEPSEEK_API_KEY,
// });

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
    model: "deepseek-chat",
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
    const { userPortfolio, recommendedPortfolio } = req.body;

    prompt = `
พอร์ตการลงทุนของผู้ใช้:
${JSON.stringify(userPortfolio, null, 2)}

พอร์ตการลงทุนที่แนะนำ:
${JSON.stringify(recommendedPortfolio, null, 2)}

โปรดวิเคราะห์ข้อมูลที่ให้:
1. เปรียบเทียบพอร์ตการลงทุนของผู้ใช้กับพอร์ตที่แนะนำ
   - อธิบายข้อแตกต่างระหว่างพอร์ตการลงทุนของผู้ใช้และพอร์ตที่แนะนำ
   - ให้ข้อเสนอแนะว่า ควรปรับเปลี่ยนพอร์ตอย่างไรเพื่อให้ตรงกับพอร์ตแนะนำมากขึ้น
2. ประเมินความเสี่ยงของพอร์ตการลงทุนของผู้ใช้
   - ความเสี่ยงจากการกระจายการลงทุนในแต่ละประเภทสินทรัพย์ (ตราสารหนี้ และ ตราสารทุน)
   - คำแนะนำเกี่ยวกับการปรับพอร์ตเพื่อจัดการกับความเสี่ยง
3. ให้คำแนะนำในการปรับสัดส่วนของสินทรัพย์ในพอร์ตเพื่อให้สมดุลและเหมาะสมกับเป้าหมายการลงทุน

กรุณาให้ข้อมูลที่ชัดเจนในการวิเคราะห์ความแตกต่างและคำแนะนำในการปรับพอร์ต
`;
    if (!userPortfolio || !recommendedPortfolio) return res.status(400).json({ error: "Data is required" });

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "deepseek-r1:7b", // เปลี่ยนเป็นโมเดลใหม่
      prompt: prompt,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
