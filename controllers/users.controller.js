const {validationResult} = require('express-validator')
const User = require('../models/user.model')
const httpStatus = require('../utils/httpStatusText')
const asyncWrapper = require('../middlewares/asyncWrapper')
const appError = require('../utils/appError')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')

const getAllUsers = asyncWrapper(
    async (req, res)=>{
        const query = req.query;
        const limit = query.limit;
        const page = query.page;
        const skip = (page - 1) * limit;
        const users = await User.find({},{"__v": false, "password": false}).limit(limit).skip(skip);
        res.send(
            {
                status: httpStatus.SUCCESS,
                data : {users}
            }
        )
    }
)

const register = asyncWrapper(
    async (req, res, next)=>{
        const {firstName, lastName, email, password, role} = req.body

        const oldUser = await User.findOne({email: email},{"__v": false, "password": false});
        if (oldUser) {
            const error = appError.create('user already exists', 400, httpStatus.FAIL)
            return next(error)
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            avatar: req.file.filename
        })
        
        // generate JWT token
        const token = generateToken({ email: newUser.email, id: newUser._id, role: newUser.role })
        newUser.token = token;

        await newUser.save()
        
        res.status(201).json({
            status: httpStatus.SUCCESS,
            data: {user: newUser}
        })
    }
)

const login = asyncWrapper(
    async (req, res, next)=>{
        const {email, password} = req.body;
        const user = await User.findOne({email: email})

        if(!email && !password) {
            const error = appError.create('email and password are required', 400, httpStatus.FAIL)
            return next(error)
        }
        
        if(!user) {
            const error = appError.create('user not found, please register first', 404, httpStatus.FAIL)
            return next(error)
        }
        
        const matchedPassword = await bcrypt.compare(password, user.password)

        if (user && matchedPassword) {
            const token = generateToken({ email: user.email, id: user._id, role: user.role })
            return res.status(200).json({
                status: httpStatus.SUCCESS,
                data: {token}
            })
        }else {
            const error = appError.create('email or password is invalid', 400, httpStatus.ERROR)
            return next(error)
        }
    }
)

module.exports = {
    getAllUsers,
    register,
    login
}