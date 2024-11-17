const express = require('express')
const app = express();

const path = require('path');

const env = require('dotenv').config();
const db = require('./config/db');
db();

// routs requiring
const userRouts = require('./routs/userRouts')
const adminRouts = require('./routs/adminRouts')


app.use(express.json());
app.use(express.urlencoded({extended:true}));

// view engine 
app.set('view engine','ejs')
app.set('views',[path.join(__dirname,'views/user'),path.join(__dirname,'views/admin')]) // views paths specifiying

// serving static folder
app.use(express.static(path.join(__dirname,'public')));


// routs setting
app.use('/',userRouts)

app.listen(process.env.PORT, ()=>{
    console.log('http://localhost:5000');
    
})


module.exports = app;
