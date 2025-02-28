const createError = require("../utils/createError");
const prisma = require("../configs/prisma");
const cloudinary = require("../configs/cloudinary"); // profile change
const fs = require("fs"); // profile change
const userController = {};

userController.getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let profile = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      }, omit: {
        password: true
      },
      include: {
        userRiskAssessments: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    // const userRiskLevel = await prisma.user

    res.json({ user: profile });
  } catch (error) {
    next(error);
  }
};

userController.changeProfile = async (req, res, next) => {
  // user can change username, email, profileImage
  try {
    const userId = req.user.id;
    // console.log(userId);

    const { username, email } = req.body;

    const image = req.file
      ? await cloudinary.uploader.upload(req.file.path)
      : null;

    const toUpdateData = {
      username,
      email,
      profileImage: image?.secure_url,
    };

    // to delete unused data before insert into db
    for (let key in toUpdateData) {
      if (!toUpdateData[key]) {
        delete toUpdateData[key];
      }
    }

    // connect to db
    const updatedProfile = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        ...toUpdateData,
      },
    });

    res.json({ user: updatedProfile });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path); // delete image from our server
    }
  }
};

userController.deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // console.log(userId);

    const deletedProfile = await prisma.user.delete({
      where: {
        id: Number(req.user.id),
      },
    });

    res.json({ message: "delete user" });
  } catch (error) {
    next(error);
  }
};

userController.saveRiskLevel = async (req, res, next) => {
  try {
    const { userRiskLevelId } = req.body;

    // insert into db
    const newRiskLevel = await prisma.userRiskAssessment.create({
      data: {
        userId: req.user.id,
        userRiskLevelId: Number(userRiskLevelId),
      },
    });

    // response
    res.json({ result: newRiskLevel })
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
