const createError = require("../utils/createError");
const prisma = require("../configs/prisma");

exports.getAllWishlists = async (req, res, next) => {
  try {
    const { page = "1", limit = "20" } = req.query;

    // check role : must be user only
    if (req.user.role !== "USER") {
      return createError(403, "Forbidden");
    }

    // validate
    if (isNaN(Number(page)) || isNaN(Number(limit))) {
      return createError(400, "invalid type for page or limit");
    }
    // setup skip page
    const skip = (Number(page) - 1) * Number(limit);

    // find from db
    const wishlists = await prisma.wishlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        classAbbr: {
          include: {
            funds: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: Number(limit),
    });

    let wishlistResult = [] 
    for (let el of wishlists) {

      const data = {
        id: el.id,
        classAbbr:  el.classAbbr.id,
        name: el.classAbbr.classAbbrName,
        note: el.note,
        rating: el.interestRating,
        group: el.classAbbr.funds.fundCompareGroup,
        description: el.classAbbr.funds.projNameTh?.trim(),
        fundRiskLevelId: el.classAbbr.funds.fundRiskLevelId,
        investCountryFlag: el.classAbbr.funds.investCountryFlag,
        urlFactsheet: el.classAbbr.funds.urlFactsheet
        
      }

      console.log(data)
      
      wishlistResult.push(data)
    }

    console.log(wishlistResult)

    res.json({
      allWishlists: wishlists,
      wishlists: wishlistResult
    });
  } catch (error) {
    next(error);
  }
};

exports.createWishlist = async (req, res, next) => {
  try {
    const { interestRating, note, classAbbrName } = req.body;

    // check role : must be user only
    if (req.user.role !== "USER") {
      return createError(403, "Forbidden");
    }
    // validate input data
    if (!interestRating) {
      return createError(400, "Rating is required.");
    }

    // if (!note) {
    //   return createError(400, "Note is required.");
    // }

    if (!classAbbrName) {
      return createError(400, "กรุณาใส่ชื่อกองทุน");
    }

    if (typeof interestRating !== "number") {
      return createError(400, "Invalid interest Rating");
    }

    // if (typeof note !== "string") {
    //   return createError(400, "Invalid note.");
    // }

    if (typeof classAbbrName !== "string") {
      return createError(400, "Invalid fund name.");
    }

    // find classAbbr id
    const classAbbrIdFound = await prisma.classAbbr.findFirst({
      where: {
        classAbbrName: classAbbrName,
      }, 
      select: {
        id: true
      }
    });

    const classAbbrId =  classAbbrIdFound?.id
    if (!classAbbrId) {
      return createError(400, "ไม่มีข้อมูลในระบบ")
    }

    // check if fund duplicate
    const checkDuplicateFund = await prisma.wishlist.findFirst({
      where: {
        userId: req.user.id,
        classAbbrId,
      },
    });

    if (checkDuplicateFund) {
      // if duplicate >> Already added to wishlist
      return createError(400, "Already added to wishlist");
    }

    // insert data into db
    const newWishlist = await prisma.wishlist.create({
      data: {
        interestRating,
        note,
        users: {
          connect: {
            id: req.user.id,
          },
        },
        classAbbr: {
          connect: {
            id: Number(classAbbrId),
          },
        },
      },
      include: {
        classAbbr: {
          include: {
            funds: true,
          },
        },
      },
    });

    res.json({
      wishlist: newWishlist,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateWishlist = async (req, res, next) => {
  try {
    const { note, interestRating } = req.body;
    const { wishlistId } = req.params;

    // validate
    if (!wishlistId) {
      return createError(400, "wishlist id is required");
    }

    //validate
    // ถ้ามี Rating ส่งมาให้เช็คก่อน
    if (interestRating) {
      if (!Number(interestRating) || (Number(interestRating) > 5 && Number(interestRating) > 1)) {
        return createError(400, "Rating must be number between 1-5");
      }
    }

    //  ถ้ามี note ส่งมาให้เช็คก่อน
    if (note) {
      if (typeof note !== "string") {
        return createError(400, "Note must be string");
      }
    }

    // prepare data to insert into db
    const toUpdateData = {
      note,
      interestRating: interestRating ? Number(interestRating) : null,
    };

    for (let key in toUpdateData) {
      if (!toUpdateData[key]) {
        delete toUpdateData[key];
      }
    }

    // connect to db
    const updatedWishlist = await prisma.wishlist.update({
      where: {
        userId: req.user.id,
        id: Number(wishlistId),
      },
      data: toUpdateData,
    });

    // revised data
    const revisedWishlist = await prisma.wishlist.findUnique({
      where: {
        userId: req.user.id,
        id: Number(wishlistId),
      },
    });

    // response to user
    res.json({
      result: revisedWishlist,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteWishlist = async (req, res, next) => {
  try {
    const { wishlistId } = req.params;
    //   console.log(req.user.role, '****')

    // check role : must be user only
    if (req.user.role !== "USER") {
      return createError(403, "Forbidden");
    }

    // validate parameter
    if (!wishlistId) {
      return createError(400, "id to be provided");
    }

    // find wishlist in db
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id: Number(wishlistId),
      },
    });

    if (!wishlist) {
      // if no wishlist >> error
      return createError(400, "No wishlist");
    }

    // console.log("****", wishlist);

    if (req.user.id !== wishlist.userId) {
      return createError(403, "Forbidden");
    }

    // delete wishlist from db
    await prisma.wishlist.delete({
      where: {
        id: Number(wishlist.id),
      },
    });

    // response to user
    res.json({
      message: `delete wishlist ${wishlistId}`,
    });
  } catch (error) {
    next(error);
  }
};
