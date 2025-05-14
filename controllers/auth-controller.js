const prisma = require("../configs/prisma")
const createError = require('../utils/createError');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authController = {};

authController.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        // console.log(email, username, password, confirmPassword);

        // validate using Zod >> Middlewares / validation.js
        // check unique email 
        const checkEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        // console.log(email)

        if (checkEmail) {
            // duplicate 
            return createError(400, "The email is already in use.")
        }

        // hash password using salt 10
        const hashedPassword = await bcrypt.hash(password, 10)

        // create variable for insert into table
        const data = {
            email, 
            username, 
            password: hashedPassword,
        }

        // insert into db
        const profile = await prisma.user.create({
            data: data
        })

        // response to user
        res.json({ message: "Register successful", user: profile })

    } catch (error) {
        next(error);
    }
};

authController.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // validate using Zod
        // check email and password match
        // // - check email in db ? 
        const profile = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!profile) {
            return createError(400, "Invalid Email")
        }

        // // - check password
        const checkPassword = await bcrypt.compare(password, profile.password)

        if (!checkPassword) {
            return createError(400, "Invalid email or password")
        }

        // generate token
        
        const user = {
            id: profile.id,
            email: profile.email,
            username: profile.username,
            role: profile.role
        }

        const token = jwt.sign(user, process.env.SECRET_KEY, {expiresIn: "1d"})

        // response to user
        res.json({ message: "Login successful",
            user,
            token
         });
    } catch (error) {
        next(error);
    }
};


module.exports = authController;