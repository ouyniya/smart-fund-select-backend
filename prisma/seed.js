// npx prisma db seed
const prisma = require("../configs/prisma");
const bcrypt = require("bcryptjs");
const { fundsData } = require("../information/funds");
const { classAbbrData } = require("../information/classAbbr");
// const { classAbbrData } = require("../information/")
const csvToJson = require("convert-csv-to-json");

const hashedPassword = bcrypt.hashSync("123456", 10);

// convert to json format
let fileInputName = "./feedetail.csv";
let feeDetialDataRaw = csvToJson
  .fieldDelimiter(",")
  .getJsonFromCsv(fileInputName);

// performance
let fileInputNamePerformance = "./performance.csv";
let fundPerformanceRiskDataRaw = csvToJson
  .fieldDelimiter(",")
  .getJsonFromCsv(fileInputNamePerformance);

// fee data
const feeDetialDataBeforeInt = JSON.parse(JSON.stringify(feeDetialDataRaw));
// let feeDetialData = [];

const insertFee = async () => {
  try {
    for (let el of feeDetialDataBeforeInt) {
      let data = {
        feeType: el.feeType,
        rate: Number(el.rate),
        rateUnit: el.rateUnit,
        actualValue: el.actualValue === "" ? null : Number(el.actualValue),
        classAbbrId: Number(el.classAbbrId),
      };

      console.log("OK####", el.classAbbrId);

      await prisma.feeDetial.create({
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// insertFee()

// performance

const fundPerformanceRiskDataInt = JSON.parse(
  JSON.stringify(fundPerformanceRiskDataRaw)
);
let fundPerformanceRiskData = [];

for (let el of fundPerformanceRiskDataInt) {
  fundPerformanceRiskData.push({
    performanceType: el.performanceType,
    performancePeriod: el.performancePeriod,
    performanceValue: Number(el.performanceValue),
    classAbbrId: Number(el.classAbbrId),
  });
}

const userData = [
  {
    username: "admin",
    email: "admin@test.com",
    password: hashedPassword,
    profileImage: "https://picsum.photos/id/17/50/50",
  },
  {
    username: "andy",
    email: "andy@test.com",
    password: hashedPassword,
    profileImage: "https://picsum.photos/id/18/50/50",
  },
  {
    username: "bob",
    email: "bob@test.com",
    password: hashedPassword,
    profileImage: "https://picsum.photos/id/19/50/50",
  },
  {
    username: "canny",
    email: "canny@test.com",
    password: hashedPassword,
    profileImage: "https://picsum.photos/id/21/50/50",
  },
  {
    username: "danny",
    email: "danny@test.com",
    password: hashedPassword,
    profileImage: "https://picsum.photos/id/20/50/50",
  },
];

const riskAssessmentResultData = [
  {
    minScore: 0,
    maxScore: 14,
  },
  {
    minScore: 15,
    maxScore: 21,
  },
  {
    minScore: 22,
    maxScore: 29,
  },
  {
    minScore: 30,
    maxScore: 36,
  },
  {
    minScore: 37,
    maxScore: 100,
  },
];

const riskAssessmentQuestionData = [
  {
    question: "ปัจจุบันคุณอายุ",
    option1: "มากกว่า 55 ปี",
    option2: "45-55 ปี",
    option3: "35-44 ปี",
    option4: "น้อยกว่า 35 ปี",
  },
  {
    question:
      "ปัจจุบันคุณมีภาระทางการเงินและค่าใช้จ่ายประจำ เช่น ค่าผ่อนบ้าน รถ ค่าใช้จ่ายส่วนตัว และค่าเลี้ยงดูครอบครัว",
    option1: "มากกว่าร้อยละ 75 ของรายได้ทั้งหมด",
    option2: "ระหว่างร้อยละ 50 ถึง 75 ของรายได้ทั้งหมด",
    option3: "ระหว่างร้อยละ 25 ถึง 50 ของรายได้ทั้งหมด",
    option4: "น้อยกว่าร้อยละ 25 ของรายได้ทั้งหมด",
  },
  {
    question: "คุณมีสถานภาพทางการเงินในปัจจุบันอย่างไร",
    option1: "มีทรัพย์สินน้อยกว่าหนี้สิน",
    option2: "มีทรัพย์สินเท่ากับหนี้สิน",
    option3: "มีทรัพย์สินมากกว่าหนี้สิน",
    option4:
      "มีความมั่นใจว่ามีเงินออมหรือเงินลงทุนเพียงพอสำหรับการใช้ชีวิตหลังเกษียณอายุแล้ว",
  },
  {
    question:
      "คุณเคยมีประสบการณ์ หรือมีความรู้ในการลงทุนในทรัพย์สินที่เสี่ยงที่สุดกลุ่มใด",
    option1: "เงินฝากธนาคาร",
    option2: "พันธบัตรรัฐบาลหรือกองทุนรวมพันธบัตรรัฐบาล",
    option3: "หุ้นกู้หรือกองทุนรวมตราสารหนี้",
    option4: "หุ้นสามัญหรือกองทุนรวมหุ้น หรือทรัพย์สินอื่นที่มีความเสี่ยงสูง",
  },
  {
    question: "ระยะเวลาที่คุณคาดว่าจะไม่มีความจำเป็นที่ต้องใช้เงินลงทุนนี้",
    option1: "ไม่เกิน 1 ปี",
    option2: "1 ถึง 3 ปี",
    option3: "3 ถึง 5 ปี",
    option4: "มากกว่า 5 ปี",
  },
  {
    question: "วัตถุประสงค์หลักในการลงทุนของคุณ คือ",
    option1: "เน้นเงินต้นต้องปลอดภัยและได้รับผลตอบแทนสม่ำเสมอแต่ต่ำได้",
    option2:
      "เน้นโอกาสได้รับผลตอบแทนที่สม่ำเสมอ แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้บ้าง",
    option3:
      "เน้นโอกาสได้รับผลตอบแทนที่สูงขึ้น แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้มากขึ้น",
    option4:
      "เน้นผลตอบแทนสูงสุดในระยะยาว แต่อาจเสี่ยงที่จะสูญเงินต้นส่วนใหญ่ได้",
  },
  {
    question: "คุณเต็มใจที่จะลงทุนในกลุ่มการลงทุนใด",
    option1: "กลุ่มการลงทุนที่ 1 มีโอกาสได้รับผลตอบแทน 2.5% โดยไม่ขาดทุนเลย",
    option2:
      "กลุ่มการลงทุนที่ 2 มีโอกาสได้รับผลตอบแทนสูงสุด 7% แต่อาจมีผลขาดทุนได้ถึง 1%",
    option3:
      "กลุ่มการลงทุนที่ 3 มีโอกาสได้รับผลตอบแทนสูงสุด 15% แต่อาจมีผลขาดทุนได้ถึง 5%",
    option4:
      "กลุ่มการลงทุนที่ 4 มีโอกาสได้รับผลตอบแทนสูงสุด 25% แต่อาจมีผลขาดทุนได้ถึง 15%",
  },
  {
    question:
      "ถ้าคุณเลือกลงทุนในทรัพย์สินที่มีโอกาสได้รับผลตอบแทนมาก แต่มีโอกาสขาดทุนสูงด้วยเช่นกัน คุณจะรู้สึกอย่างไร",
    option1: "กังวลและตื่นตระหนกกลัวขาดทุน",
    option2: "ไม่สบายใจแต่พอเข้าใจได้บ้าง",
    option3: "เข้าใจและรับความผันผวนได้ในระดับหนึ่ง",
    option4:
      "ไม่กังวลกับโอกาสขาดทุนสูง และหวังกับผลตอบแทนที่อาจจะได้รับสูงขึ้น",
  },
  {
    question:
      "คุณจะรู้สึกกังวล/รับไม่ได้ เมื่อมูลค่าเงินลงทุนของคุณมีการปรับตัวลดลงในสัดส่วนเท่าใด",
    option1: "5% หรือน้อยกว่า",
    option2: "มากกว่า 5%-10%",
    option3: "มากกว่า 10%-20%",
    option4: "มากกว่า 20% ขึ้นไป",
  },
  {
    question:
      "หากปีที่แล้วคุณลงทุนไป 100,000 บาท ปีนี้คุณพบว่ามูลค่าเงินลงทุนลดลงเหลือ 85,000 บาท คุณจะทำอย่างไร",
    option1: "ตกใจ และต้องการขายการลงทุนที่เหลือทิ้ง",
    option2:
      "กังวลใจ และจะปรับเปลี่ยนการลงทุนบางส่วนไปในทรัพย์สินที่เสี่ยงน้อยลง",
    option3: "อดทนถือต่อไปได้ และรอผลตอบแทนปรับตัวกลับมา",
    option4:
      "ยังมั่นใจ เพราะเข้าใจว่าต้องลงทุนระยะยาว และจะเพิ่มเงินลงทุนในแบบเดิมเพื่อเฉลี่ยต้นทุน",
  },
];

const userRiskAssessmentData = [
  {
    userId: 2,
    userRiskLevelId: 3,
  },
  {
    userId: 2,
    userRiskLevelId: 5,
  },
  {
    userId: 3,
    userRiskLevelId: 1,
  },
  {
    userId: 4,
    userRiskLevelId: 5,
  },
];

const riskLevelMappingData = [
  {
    userRiskLevelId: 1,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนเฉพาะในประเทศ",
  },
  {
    userRiskLevelId: 2,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนเฉพาะในประเทศ",
  },
  {
    userRiskLevelId: 2,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนในต่างประเทศบางส่วน",
  },
  {
    userRiskLevelId: 2,
    fundRiskLevelName: "กองทุนรวมพันธบัตรรัฐบาล",
  },
  {
    userRiskLevelId: 2,
    fundRiskLevelName: "กองทุนรวมตราสารหนี้",
  },
  {
    userRiskLevelId: 3,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนเฉพาะในประเทศ",
  },
  {
    userRiskLevelId: 3,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนในต่างประเทศบางส่วน",
  },
  {
    userRiskLevelId: 3,
    fundRiskLevelName: "กองทุนรวมพันธบัตรรัฐบาล",
  },
  {
    userRiskLevelId: 3,
    fundRiskLevelName: "กองทุนรวมตราสารหนี้",
  },
  {
    userRiskLevelId: 3,
    fundRiskLevelName: "กองทุนรวมผสม",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนเฉพาะในประเทศ",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนในต่างประเทศบางส่วน",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมพันธบัตรรัฐบาล",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมตราสารหนี้",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมผสม",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมตราสารแห่งทุน(กองทุนรวมหุ้น)",
  },
  {
    userRiskLevelId: 4,
    fundRiskLevelName: "กองทุนรวมหมวดอุตสาหกรรม",
  },

  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนเฉพาะในประเทศ",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมตลาดเงินที่ลงทุนในต่างประเทศบางส่วน",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมพันธบัตรรัฐบาล",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมตราสารหนี้",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมผสม",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมตราสารแห่งทุน(กองทุนรวมหุ้น)",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมหมวดอุตสาหกรรม",
  },
  {
    userRiskLevelId: 5,
    fundRiskLevelName: "กองทุนรวมที่ลงทุนในสินทรัพย์ทางเลือก",
  },
];

const recommendPortData = [
  {
    userRiskLevelId: 1,
    investmentType: "กองทุนรวมพันธบัตรรัฐบาลระยะสั้น",
    weight: 0.3,
  },
  {
    userRiskLevelId: 1,
    investmentType: "กองทุนรวมตลาดเงินที่ลงทุนในประเทศ",
    weight: 0.4,
  },
  {
    userRiskLevelId: 1,
    investmentType: "กองทุนรวมตราสารหนี้ระยะยาว",
    weight: 0.2,
  },
  {
    userRiskLevelId: 1,
    investmentType: "กองทุนรวมตราสารทุน",
    weight: 0.1,
  },

  {
    userRiskLevelId: 2,
    investmentType: "กองทุนรวมพันธบัตรรัฐบาลระยะสั้น",
    weight: 0.3,
  },
  {
    userRiskLevelId: 2,
    investmentType: "กองทุนรวมตลาดเงินที่ลงทุนในประเทศ",
    weight: 0.2,
  },
  {
    userRiskLevelId: 2,
    investmentType: "กองทุนรวมตราสารหนี้ระยะยาว",
    weight: 0.3,
  },
  {
    userRiskLevelId: 2,
    investmentType: "กองทุนรวมตราสารทุน",
    weight: 0.2,
  },

  {
    userRiskLevelId: 3,
    investmentType: "กองทุนรวมพันธบัตรรัฐบาลระยะสั้น",
    weight: 0.2,
  },
  {
    userRiskLevelId: 3,
    investmentType: "กองทุนรวมตลาดเงินที่ลงทุนในประเทศ",
    weight: 0.1,
  },
  {
    userRiskLevelId: 3,
    investmentType: "กองทุนรวมตราสารหนี้ระยะยาว",
    weight: 0.3,
  },
  {
    userRiskLevelId: 3,
    investmentType: "กองทุนรวมตราสารทุน",
    weight: 0.3,
  },
  {
    userRiskLevelId: 3,
    investmentType: "กองทุนรวมทองคำ",
    weight: 0.1,
  },

  {
    userRiskLevelId: 4,
    investmentType: "กองทุนรวมพันธบัตรรัฐบาลระยะสั้น",
    weight: 0.1,
  },
  {
    userRiskLevelId: 4,
    investmentType: "กองทุนรวมตราสารหนี้ระยะยาว",
    weight: 0.3,
  },
  {
    userRiskLevelId: 4,
    investmentType: "กองทุนรวมตราสารทุน",
    weight: 0.4,
  },
  {
    userRiskLevelId: 4,
    investmentType: "กองทุนรวมทองคำ",
    weight: 0.2,
  },

  {
    userRiskLevelId: 5,
    investmentType: "กองทุนรวมตราสารหนี้ระยะยาว",
    weight: 0.1,
  },
  {
    userRiskLevelId: 5,
    investmentType: "กองทุนรวมตราสารทุน",
    weight: 0.7,
  },
  {
    userRiskLevelId: 5,
    investmentType: "กองทุนรวมทองคำ",
    weight: 0.2,
  },
];

const recommendCriteriaData = [
  {
    userRiskLevelId: 1,
    fundAssetType:
      "เงินฝากและตราสารหนี้ระยะสั้น และตราสารหนี้ภาครัฐอายุมากกว่า 1 ปี",
    percentInvest: "65% ขึ้นไป",
  },
  {
    userRiskLevelId: 1,
    fundAssetType: "หุ้นกู้",
    percentInvest: "ไม่เกิน 20%",
  },
  {
    userRiskLevelId: 1,
    fundAssetType: "หุ้น",
    percentInvest: "ไม่เกิน 10%",
  },
  {
    userRiskLevelId: 1,
    fundAssetType: "การลงทุนทางเลือก",
    percentInvest: "ไม่เกิน 5%",
  },

  {
    userRiskLevelId: 2,
    fundAssetType: "เงินฝากและตราสารหนี้ระยะสั้น",
    percentInvest: "ไม่เกิน 20%",
  },
  {
    userRiskLevelId: 2,
    fundAssetType: "ตราสารหนี้ภาครัฐอายุมากกว่า 1 ปี และหุ้นกู้",
    percentInvest: "ไม่เกิน 70%",
  },
  {
    userRiskLevelId: 2,
    fundAssetType: "หุ้น",
    percentInvest: "ไม่เกิน 20%",
  },
  {
    userRiskLevelId: 2,
    fundAssetType: "การลงทุนทางเลือก",
    percentInvest: "ไม่เกิน 10%",
  },

  {
    userRiskLevelId: 3,
    fundAssetType: "เงินฝากและตราสารหนี้ระยะสั้น",
    percentInvest: "ไม่เกิน 10%",
  },
  {
    userRiskLevelId: 3,
    fundAssetType: "ตราสารหนี้ภาครัฐอายุมากกว่า 1 ปี และหุ้นกู้",
    percentInvest: "ไม่เกิน 60%",
  },
  {
    userRiskLevelId: 3,
    fundAssetType: "หุ้น",
    percentInvest: "ไม่เกิน 30%",
  },
  {
    userRiskLevelId: 3,
    fundAssetType: "การลงทุนทางเลือก",
    percentInvest: "ไม่เกิน 10%",
  },

  {
    userRiskLevelId: 4,
    fundAssetType: "เงินฝากและตราสารหนี้ระยะสั้น",
    percentInvest: "ไม่เกิน 10%",
  },
  {
    userRiskLevelId: 4,
    fundAssetType: "ตราสารหนี้ภาครัฐอายุมากกว่า 1 ปี และหุ้นกู้",
    percentInvest: "ไม่เกิน 40%",
  },
  {
    userRiskLevelId: 4,
    fundAssetType: "หุ้น",
    percentInvest: "ไม่เกิน 40%",
  },
  {
    userRiskLevelId: 4,
    fundAssetType: "การลงทุนทางเลือก",
    percentInvest: "ไม่เกิน 20%",
  },

  {
    userRiskLevelId: 5,
    fundAssetType: "เงินฝากและตราสารหนี้ระยะสั้น",
    percentInvest: "ไม่เกิน 5%",
  },
  {
    userRiskLevelId: 5,
    fundAssetType: "ตราสารหนี้ภาครัฐอายุมากกว่า 1 ปี และหุ้นกู้",
    percentInvest: "ไม่เกิน 30%",
  },
  {
    userRiskLevelId: 5,
    fundAssetType: "หุ้น",
    percentInvest: "60% ขึ้นไป",
  },
  {
    userRiskLevelId: 5,
    fundAssetType: "การลงทุนทางเลือก",
    percentInvest: "ไม่เกิน 30%",
  },
];

const fundRiskLevelData = [
  {
    fundRiskLevelName: "กองทุนรวมตลาดเงินในประเทศ",
    fundInvestment: "เงินฝากและตราสารหนี้ที่มีอายุเฉลี่ยไม่เกิน 3 เดือน",
  },
  {
    fundRiskLevelName: "กองทุนรวมตลาดเงินในประเทศผสมต่างประเทศ",
    fundInvestment:
      "กองทุนที่ลงทุนในสินทรัพย์เหมือนระดับ 1 แต่ลงทุนในต่างประเทศไม่เกินร้อยละ 50 ของสินทรัพย์สุทธิ",
  },
  {
    fundRiskLevelName: "กองทุนรวมพันธบัตรรัฐบาล",
    fundInvestment: "กองทุนที่ลงทุนในพันธบัตรรัฐบาล",
  },
  {
    fundRiskLevelName: "กองทุนรวมตราสารหนี้",
    fundInvestment: "กองทุนที่ลงทุนในตราสารหนี้ทั่วไป",
  },
  {
    fundRiskLevelName: "กองทุนรวมผสม",
    fundInvestment: "กองทุนที่ลงทุนในทั้งหุ้นและตราสารหนี้",
  },
  {
    fundRiskLevelName: "กองทุนรวมตราสารทุน",
    fundInvestment: "กองทุนที่ลงทุนในหุ้น",
  },
  {
    fundRiskLevelName: "กองทุนรวมหมวดอุตสาหกรรม",
    fundInvestment:
      "กองทุนที่ลงทุนในหุ้นที่กระจุกตัวอยู่ในกลุ่มอุตสาหกรรมเดียวกันโดยเฉพาะ",
  },
  {
    fundRiskLevelName: "กองทุนรวมสินทรัพย์ทางเลือก",
    fundInvestment: "กองทุนที่ลงทุนในสินทรัพย์ทางเลือก เช่น น้ำมัน ทองคำ",
  },
];

const companyData = [
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนกสิกรไทย จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนเอ็มเอฟซี จำกัด (มหาชน)",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนเมอร์ชั่น พาร์ทเนอร์ จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนทหารไทย จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนไทยพาณิชย์ จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนอเบอร์ดีน (ประเทศไทย) จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนทิสโก้ จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนรวมบัวหลวง จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนกรุงไทย จำกัด (มหาชน)",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุน วรรณ จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนยูโอบี (ประเทศไทย) จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนกรุงศรี จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนธนชาต จำกัด",
  },
  {
    companyName:
      "บริษัท หลักทรัพย์จัดการกองทุนสยาม ไนท์ ฟันด์ แมเนจเม้นท์ จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนฟินันซ่า จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนแอสเซท พลัส จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนเกียรตินาคินภัทร จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนพรินซิเพิล จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนเอ็กซ์สปริง จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนรวมฟิลลิป จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนเคดับบลิวไอ จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนเรนเนสซานซ์ จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนแลนด์ แอนด์ เฮ้าส์ จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนบางกอกแคปปิตอล จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนทาลิส จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนดาโอ จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนเอไอเอ (ประเทศไทย) จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนซาวาคามิ (ประเทศไทย) จำกัด",
  },
  {
    companyName: "บริษัท หลักทรัพย์จัดการกองทุนอีสท์สปริง (ประเทศไทย) จำกัด",
  },
];

console.log("db seed...user");

async function seedDB() {
  await prisma.user.createMany({
    data: userData,
  });
  await prisma.riskAssessmentResult.createMany({
    data: riskAssessmentResultData,
  });
  await prisma.riskAssessmentQuestion.createMany({
    data: riskAssessmentQuestionData,
  });
  await prisma.userRiskAssessment.createMany({
    data: userRiskAssessmentData,
  });
  await prisma.riskLevelMapping.createMany({
    data: riskLevelMappingData,
  });
  await prisma.recommendPort.createMany({
    data: recommendPortData,
  });
  await prisma.recommendCriteria.createMany({
    data: recommendCriteriaData,
  });
  await prisma.fundRiskLevel.createMany({
    data: fundRiskLevelData,
  });
  await prisma.company.createMany({
    data: companyData,
  });
  // ---
  await prisma.funds.createMany({
    data: fundsData,
  });

  await prisma.classAbbr.createMany({
    data: classAbbrData,
  });

  // await prisma.feeDetial.createMany({
  //   data: feeDetialData,
  // });

  // await prisma.fundPerformanceRisk.createMany({
  //   data: fundPerformanceRiskData,
  // });
}

async function seedDBPfm() {
  await prisma.fundPerformanceRisk.createMany({
    data: fundPerformanceRiskData,
  });
}

// console.log(fundsData)

seedDB();
insertFee();
seedDBPfm();
