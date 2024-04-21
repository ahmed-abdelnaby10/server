const mongoose = require('mongoose');
const validator = require('validator')
const userRole = require('../utils/userRole')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'field must be a valid email']
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [userRole.USER, userRole.MANAGER, userRole.ADMIN],
        default: userRole.USER
    },
    avatar: {
        type: String,
        default: 'uploads/avatar-01.png'
    }
})

module.exports = mongoose.model('User', userSchema)