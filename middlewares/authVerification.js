const jwt = require('jsonwebtoken')
const httpStatus = require('../utils/httpStatusText')
const appError = require('../utils/appError')

const authVerification = async (req, res, next)=>{
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    if (!authHeader) {
        const error = appError.create('Token required', 401, httpStatus.ERROR)
        return next(error)
    }

    const token = authHeader.split(' ')[1]
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.currentUser = currentUser;
        next()
    }catch {
        const error = appError.create('Invalid Token', 401, httpStatus.ERROR)
        return next(error)
    }
}

module.exports = authVerification;