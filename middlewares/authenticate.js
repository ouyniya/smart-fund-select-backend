const createError = require('../utils/createError')
const jwt = require('jsonwebtoken');
const prisma = require('../configs/prisma')

const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    console.log(authorization) 

    if (!authorization || !authorization.startsWith('Bearer')) {
      return createError(401, "unauthorized")
    }

    const token = authorization.split(" ")[1]

    if (!token) {
      return createError(401, "unauthorized")
    }

    const jwtPayload = jwt.verify(token, process.env.SECRET_KEY)
    // console.log(jwtPayload)

    const user = await prisma.user.findFirst({
      where: {
        id: jwtPayload.id
      }
    })

    if (!user) {
      return createError(400, "User not found")
    }

    delete user.password  

    req.user = user // send user obj { username, firstName, lastName, email, ... } within the request 

    next()

  } catch (error) {
    next(error)
  }
};

module.exports = authenticate;