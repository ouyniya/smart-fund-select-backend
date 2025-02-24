const createError = require("../utils/createError");
const prisma = require("../configs/prisma");

exports.getAllWishlist = async (req, res, next) => {
  try {
    const { page = "1", limit = "25" } = req.query;

    // check role : must be user only
    if (req.user.role !== 'USER') {
        return createError(403, "Forbidden")
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
                funds: true
            }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: Number(limit),
    });

    res.json({
      wishlists: wishlists,
    });
  } catch (error) {
    next(error);
  }
};

exports.createWishlist = async (req, res, next) => {
  try {
    const { interestRating, note, classAbbrId } = req.body;

    // check role : must be user only
    if (req.user.role !== "USER") {
      return createError(403, "Forbidden");
    }
    // validate input data
    if (!interestRating) {
      return createError(400, "Rating is required.");
    }

    if (!note) {
      return createError(400, "Note is required.");
    }

    if (!classAbbrId) {
      return createError(400, "Fund is required.");
    }

    if (typeof interestRating !== "number") {
      return createError(400, "Invalid interest Rating");
    }

    if (typeof note !== "string") {
      return createError(400, "Invalid note.");
    }

    if (typeof classAbbrId !== "number") {
      return createError(400, "Invalid fund id.");
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
        classAbbr: true,
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
    

    // response to user
    res.json({
      message: "updated",
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
