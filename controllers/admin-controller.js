const createError = require("../utils/createError");
const prisma = require("../configs/prisma");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res, next) => {
  try {
    // check role
    if (req.user.role !== "ADMIN") {
      return createError(403, "Forbidden");
    }

    // get data from db 
    // อย่าลืมลบ password จาก data ที่แสดงด้วย
    const allUsers = await prisma.user.findMany({
      omit: {
        password: true
      }
    });

    res.json({ message: allUsers });
  } catch (error) {
    next(error);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const { email, username, password, confirmPassword } = req.body;
    // validate using Zod >> Middlewares / validation.js
    // check unique email
    const checkEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkEmail) {
      // duplicate
      return createError(400, "The email is already in use.");
    }

    // hash password using salt 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // check role
    if (req.user.role !== "ADMIN") {
      return createError(403, "Forbidden");
    }

    const profile = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    res.json({ message: "add user successful", user: profile });
  } catch (error) {
    next(error);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    // check role
    if (req.user.role !== "ADMIN") {
      return createError(403, "Forbidden");
    }

    const { userId, role } = req.body;
    const updatedProfile = await prisma.user.update({
        where: {
            id: Number(userId)
        }, 
        data: {
            role: role
        }
    });

    res.json({ message: "update role success" });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // check role
    if (req.user.role !== "ADMIN") {
      return createError(403, "Forbidden");
    }

    const { userId } = req.params

    const deletedProfile = await prisma.user.delete({
        where: {
            id: Number(userId)
        },
        select: {
            id: true
        }
    })

    res.json({ message: "delete user successfully",
        id: deletedProfile.id
     });
  } catch (error) {
    next(error);
  }
};
