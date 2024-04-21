const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller')
const authVerification = require('../middlewares/authVerification')
const multer = require('multer')
const appError = require('../utils/appError')

const diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log("FILE", file);
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split("/")[1]
        const filename = `user-${Date.now()}.${ext}`
        cb(null, filename)
    }
})

const fileFilter = (req, file, cb)=>{
    const fileType = file.mimetype.split("/")[0]
    if (fileType === 'image') {
        return cb(null, true)
    }else {
        return cb(appError.create('Only images allowed', 400))
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter
})

router.route('/')
            .get(authVerification ,usersController.getAllUsers)

router.route('/register')
            .post(upload.single('avatar'), usersController.register)

router.route('/login')
            .post(usersController.login)

module.exports = router