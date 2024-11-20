const userSchema = require('../../models/userSchema') // requiring user schema
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
// const User = require('../../models/userSchema');
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
        req.session.userData = {email,password,username,phone,dob}

        res.render("otp",{eemail:email})
        console.log("otp send",otp);
        console.log("to ",email);
   
    }catch(error){
        console.log('server error', error);
        res.redirect('*')
    }


};


const securePassword = async(password)=>{
    try {
        
        const hashPassword = await bcrypt.hash(password,10)
        return hashPassword;
    } catch (error) {
        
    }
}



const verifyOTP = async (req, res) => {
    try {
      const { otp1 } = req.body;
      console.log(req.body);
      console.log('Received OTP:', otp1);
      console.log('Session OTP:', req.session.userOtp);
  
      // Compare OTPs as strings to avoid type issues
      if (String(otp1) === String(req.session.userOtp)) {
        const user = req.session.userData;
        const hashPassword = await securePassword(user.password);
        console.log('Hashed password:', hashPassword);
  
        const saveUserData = new userSchema({
          username: user.username,
          email: user.email,
          phone: user.phone,
          password: hashPassword,
          dob: user.dob,
        });
  
        // Save the new user to the database
        await saveUserData.save();
  
        req.session.user = saveUserData._id;
        res.status(200).json({ success: true, redirectUrl: "/" });
      } else {
        console.log('OTP verification failed.');
        // Send a JSON response indicating failure
        res.status(400).json({ success: false, message: "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error Verifying OTP:", error);
      res.status(500).json({ success: false, message: "An error occurred while verifying the OTP" });
    }
  };
  
// resend otp 

const resendOtp = async(req,res)=>{
    try {
        
        const {email} = req.session.userData;
        console.log(email);
        if(!email){
            return res.status(400).json({success:false,message:"Email not find in sesion ..!"})
        }
        const otp = generateOtp();
        req.session.userOtp=otp;

        const sendEmal = await sendVerificationEmail(email,otp)
        if(sendEmal){
            console.log("ree",otp);
           res.status(200).json({succesas:true,message:"OTP resended"}) 
        }else{
           res.status(500).json({success:false,message:"OTP resending Failed"}) 
        }


    } catch (error) {
        console.error("Error resending OTP",error);
        res.status(500).json({success:false,message:"Internal servaer error , Please try again..!"})
        
    }
}











module.exports = {
    loaduserHome,erroPage,loadUserLogin,userSignUp,SignUp,verifyOTP,resendOtp
}