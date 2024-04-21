const {body} = require('express-validator')

const validationCourse = ()=> {
    return [
        body('title')
            .notEmpty()
            .withMessage("title is required")
            .isLength({min: 2})
            .withMessage("title must be more than 2"), 
        body('price')
            .notEmpty()
            .withMessage("price is required"), 
    ]
}

module.exports = {
    validationCourse
}