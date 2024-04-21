require('dotenv').config()
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');
const httpStatusText = require('./utils/httpStatusText')
const path = require('path')

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const url = process.env.MONGO_URL;

mongoose.connect(url).then(()=>{
    console.log('MongoDB connected successfully!');
});

app.use(cors())
app.use(express.json());

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);


app.all('*', (req, res, next)=>{
    res.status(404).json({
        status: httpStatusText.ERROR,
        message: 'This resource is not available'
    })
})

app.use((error, req, res, next)=>{
    res.status(error.statusCode || 500).json({
            status: error.statusText || httpStatusText.FAIL,
            message: error.message,
            code: error.statusCode,
            data: null
        })
})

app.listen(5000, ()=>{
    console.log("Listening on port: 5000");
});