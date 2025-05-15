// const OpenAI = require("openai");
const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const aiController = {};

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // ใช้ OpenAI แทน
// });

async function analyzePortfolio(userPortfolio, recommendPort) {
  // const prompt = `
  //   พอร์ตของผู้ใช้:
  //   ${JSON.stringify(userPortfolio, null, 2)}
    
  //   พอร์ตตัวอย่างที่แนะนำ:
  //   ${JSON.stringify(recommendPort, null, 2)}
    
  //   ค่า weight เช่น 0.3 หมายถึง 30% เวลาตอบให้ตอบเป็นหน่วย % 

  //   ช่วยวิเคราะห์ว่า:
  //   - พอร์ตของผู้ใช้ต่างจากพอร์ตตัวอย่างที่แนะนำอย่างไร
  //   - ควรปรับพอร์ตของผู้ใช้อย่างไรให้เหมาะสม ยกเว้นกรณีเป็นกองทุนรวมผสมให้บอกผู้ใช้ให้ศึกษารายละเอียดจากหนังสือชี้ชวนของกองทุน
  //   - ความเสี่ยงของพอร์ตของผู้ใช้ กรณีเป็นกองทุนรวมผสมให้บอกผู้ใช้ให้ศึกษารายละเอียดจากหนังสือชี้ชวนของกองทุน

  //   Your response should be provided strictly in HTML format using only <p> tags. Do not use <ul>, <li>,  Markdown formatting,  newline characters (\n), or any other list-related tags.

  //   `;

//   return prompt;

    // const completion = await openai.chat.completions.create({
    //   messages: [{ role: "user", content: prompt }],
    //   model: "gpt-4o-mini",
    // });

    // return completion.choices[0].message.content;
}

aiController.getUserPort = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const portfolio = await prisma.userPortfolio.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        classAbbrs: {
          include: {
            funds: {
              select: {
                fundCompareGroup: true,
              },
            },
          },
        },
      },
    });

    res.json({ portfolio });
  } catch (error) {
    next(error);
  }
};

aiController.addUserPort = async (req, res, next) => {
  try {
    const { classAbbrName, amount } = req.body;

    // validate
    if (!classAbbrName) {
      return createError(400, "กรุณาใส่ชื่อกองทุน");
    }

    if (!amount) {
      return createError(400, "กรุณาใส่จำนวนเงินลงทุน");
    }

    if (typeof classAbbrName !== "string") {
      return createError(400, "ใส่ข้อมูลชื่อกองทุนไม่ถูกต้อง");
    }

    if (typeof amount !== "number") {
      return createError(400, "ใส่ข้อมูลจำนวนเงินไม่ถูกต้อง");
    }

    // find classAbbr id
    const classAbbrIdFound = await prisma.classAbbr.findFirst({
      where: {
        classAbbrName: classAbbrName,
      },
      select: {
        id: true,
      },
    });

    const classAbbrId = classAbbrIdFound?.id;
    if (!classAbbrId) {
      return createError(400, "ไม่มีข้อมูลในระบบ");
    }

    // check if fund duplicate
    const checkDuplicateFund = await prisma.userPortfolio.findFirst({
      where: {
        userId: Number(req.user.id),
        classAbbrId,
      },
    });

    if (checkDuplicateFund) {
      // if duplicate >> Already added to wishlist
      return createError(400, "คุณเคยเพิ่มกองทุนนี้ไปแล้ว");
    }

    const portfolio = await prisma.userPortfolio.create({
      data: {
        userId: Number(req.user.id),
        classAbbrId: Number(classAbbrId),
        amount: Number(amount),
      },
    });

    res.json({ portfolio });
  } catch (error) {
    next(error);
  }
};

aiController.updateUserPort = async (req, res, next) => {
  try {
    const { userPortId } = req.params;
    const { amount } = req.body;

    // validate
    if (!userPortId) {
      return createError(400, "กรุณาใส่ข้อมูลให้ครบถ้วน");
    }

    if (!amount) {
      return createError(400, "กรุณาใส่จำนวนเงินลงทุน");
    }

    if (typeof amount !== "number") {
      return createError(400, "ใส่ข้อมูลไม่ถูกต้อง");
    }

    if (typeof Number(userPortId) !== "number") {
      return createError(400, "ใส่ข้อมูลไม่ถูกต้อง");
    }

    // find port
    const userPort = await prisma.userPortfolio.findFirst({
      where: {
        id: Number(userPortId),
        userId: Number(req.user.id),
      },
    });

    if (!userPort) {
      return createError(
        400,
        "ไม่มีข้อมูลในระบบหรือคุณไม่มีสิทธืเข้าถึงข้อมูลนี้"
      );
    }

    const portfolio = await prisma.userPortfolio.update({
      where: {
        id: Number(userPortId),
        userId: Number(req.user.id),
      },
      data: {
        amount: Number(amount),
      },
    });

    res.json({ portfolio });
  } catch (error) {
    next(error);
  }
};

aiController.deleteUserPort = async (req, res, next) => {
  try {
    const { userPortId } = req.params;

    // validate
    if (!userPortId) {
      return createError(400, "กรุณาส่ง id มาด้วย");
    }

    // if (typeof userPortId !== "number") {
    //   return createError(400, "ใส่ข้อมูลไม่ถูกต้อง");
    // }

    // find
    const checkExist = await prisma.userPortfolio.findFirst({
      where: {
        id: Number(userPortId),
        userId: Number(req.user.id),
      },
    });

    if (!checkExist) {
      return createError(
        400,
        "ไม่มีข้อมูลในระบบหรือคุณไม่มีสิทธืเข้าถึงข้อมูลนี้"
      );
    }

    // connect to db
    const portfolio = await prisma.userPortfolio.delete({
      where: {
        id: Number(userPortId),
        userId: Number(req.user.id),
      },
    });

    res.json({
      message: `delete user's portfolio id ${userPortId} successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

aiController.getAnalysis = async (req, res, next) => {

  try {
    const { userPortfolio, recommendPort } = req.body;
    // const analysis = await analyzePortfolio(userPortfolio, recommendPort);

    // res.json({ analysis });
    res.json({ message: "No data" })
  } catch (error) {
    next(error);
  }
};

module.exports = aiController;
