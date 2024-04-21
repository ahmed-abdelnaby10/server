const appError = require("../utils/appError")
const httpStatusText = require("../utils/httpStatusText")

module.exports = (...roles)=>{
    return (req, res, next)=>{
        if (!roles.includes(req.currentUser.role)) {
            return next(appError.create("You aren't allowed to this action", 401, httpStatusText.FAIL))
        }
        next()
    }
}