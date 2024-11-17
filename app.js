const express = require('express')
const app = express();
const env = require('dotenv').config();
const db = require('./config/db');
db();


app.listen(process.env.PORT, ()=>{
    console.log('http://localhost:5000');
    
})


module.exports = app;
