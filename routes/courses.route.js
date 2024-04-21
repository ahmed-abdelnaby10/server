const express = require('express')
const authVerification = require('../middlewares/authVerification')
const coursesController = require('../controllers/courses.controller')
const validationCourse = require('../middlewares/validationCourse')
const allowedTo = require('../middlewares/allowedTo')
const userRole = require('../utils/userRole')

const router = express.Router()


router.route('/')
            .get(authVerification, coursesController.getAllCourses)
            .post(authVerification, coursesController.addCourse)

router.route('/:courseId')
            .get(authVerification, coursesController.getCourse)
            .patch(authVerification, coursesController.updateCourse)
            .delete(authVerification, allowedTo(userRole.ADMIN, userRole.MANAGER), coursesController.deleteCourse)

module.exports = router