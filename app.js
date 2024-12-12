const express = require('express')
const app = express();
const session = require('express-session');
const nocache = require('nocache')


const passport = require("./config/passport")

const path = require('path');

const env = require('dotenv').config();
const db = require('./config/db');
db();

// routs requiring
const userRouts = require('./routs/userRouts')
const adminRouts = require('./routs/adminRouts');

// session 
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:72*60*60*1000
    }
}));

// nocache setting
app.use(nocache());

app.use(passport.initialize())
app.use(passport.session())



app.use('/signup', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
 next();
});
app.use('/login', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});
// app.use('/admin/login', (req, res, next) => {
//     res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     res.set('Pragma', 'no-cache');
//     res.set('Expires', '0');
//     next();
// });



app.use(express.json());
app.use(express.urlencoded({extended:true}));

// view engine 
app.set('view engine','ejs')
app.set('views',[path.join(__dirname,'views/user'),path.join(__dirname,'views/admin')]) // views paths specifiying

// serving static folder
app.use(express.static(path.join(__dirname,'public')));


// routs setting
app.use('/',userRouts)
app.use('/admin',adminRouts)

app.listen(process.env.PORT,'0.0.0.0', ()=>{
    console.log('http://localhost:5000');
    
})


module.exports = app;
