require('dotenv').config()
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');
const httpStatusText = require('./utils/httpStatusText')
const path = require('path')
const bodyParser = require('body-parser')

const app = express();


const url = process.env.MONGO_URL;

mongoose.connect(url).then(()=>{
    console.log('MongoDB connected successfully!');
});

app.use(cors({
    origin: "*"
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log("Listening on port: 5000");
});