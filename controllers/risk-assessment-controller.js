const createError = require("../utils/createError");
const prisma = require("../configs/prisma");
const riskAssessmentController = {};

riskAssessmentController.getQuestions = async (req, res, next) => {
  try {
    const riskQuestion = await prisma.riskAssessmentQuestion.findMany();

    // response
    // {
    //     "riskQuestion": [
    //         {
    //             "id": 1,
    //             "question": "ปัจจุบันคุณอายุ",
    //             "option1": "มากกว่า 55 ปี",
    //             "option2": "45-55 ปี",
    //             "option3": "35-44 ปี",
    //             "option4": "น้อยกว่า 35 ปี"
    //         },

    res.json({ riskQuestion });
  } catch (error) {
    next(error);
  }
};

riskAssessmentController.getResult = async (req, res, next) => {
  try {
    const { score } = req.query;

    // mapping risk level with criteria
    const userRiskLevel = await prisma.riskAssessmentResult.findFirst({
      where: {
        AND: {
          minScore: {
            lte: Number(score),
          },
          maxScore: {
            gte: Number(score),
          },
        },
      },
      include: {
        riskLevelMapping: true,
        recommendCriteria: true,
        recommendPort: true
      }

    });

    res.json({ result: userRiskLevel });
  } catch (error) {
    next(error);
  }
};

module.exports = riskAssessmentController;
