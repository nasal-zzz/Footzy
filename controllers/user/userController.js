const userSchema = require('../../models/userSchema') // requiring user schema
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const env = require("dotenv").config();

//  lod error page 
const erroPage = async(req,res)=>{
    try {
        res.render('404')

    } catch (error) {
        res.redirect('*')
    }
}

// lodd home page
const loaduserHome = async(req,res)=>{
    try{

return res.render('home',{title:'Home'})

    }catch(error){

console.log('not found');
res.status(500).send('server error')

    }
}


// load login page
const loadUserLogin = async(req,res)=>{
    try{
        res.render('login',{title:'Login'})
    }catch(error){
        console.log('home page not loading');
        res.status(500).send('server error')
    }
}

// load signup pagev
const userSignUp = async(req,res)=>{
    try {
        res.render('signup',{title:'Sign Up'})
    } catch (error) {
        console.log('sign up page loading error');
        res.status(500).send('server error')
    }
}

// otp 
function generateOtp(){
    return Math.floor(100000 +Math.random()*900000).toString();
}

// email send
async function sendVerificationEmail(email,otp) {
    try {
        const transport = nodemailer.createTransport({
            service:'gmail',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_EMAIL,
                pass:process.env.NODEMAILER_PASSWORD
            }
        })

         const info = await transport.sendMail({
            from : process.env.NODEMAILER_EMAIL,
            to : email,
            subject:"Verify your account",
            text: `Your OTP is ${otp}`,
            html :`<b> Your OTP : ${otp}</b>`
         })
         return info.accepted.length > 0;
        
    } catch (error) {
        console.log("error sending email",error);
        return false;
        
    }    
}


//post signup 
const SignUp = async (req, res) => {

    try{
        const {username,email,password,dob,phone} = req.body;

        // checking the user is already exist 
        const user = await userSchema.findOne({email})

        if(user){
            return res.render('signup',{message:'User already exist!!'})
        }

        const otp = generateOtp();

        const sentEmail = await sendVerificationEmail(email,otp);
        if(!sentEmail){
            return res.json("email-error")
        }

        req.session.userOtp = otp    
        req.session.userData = {email,password}

        res.render("otp")
        console.log("otp send",otp);
        



//         // hash the password for security
// const hashPassword = await bcrypt.hash(password,10)

// // creating a new user instance
// const newUser = new userSchema({
//     username,
//     email,
//     password : hashPassword,
//     phone,
//     dob
// })

// // Save the new user to the database
// await newUser.save();

//     res.render('home')
        

    }catch(error){
        console.log('server error', error);
        res.redirect('*')
    }


};


module.exports = {
    loaduserHome,erroPage,loadUserLogin,userSignUp,SignUp
}