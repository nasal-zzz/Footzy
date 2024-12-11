const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
// const User = require('../../models/userSchema');
const env = require("dotenv").config();

//  lod error page 
const erroPage = async(req,res)=>{
    try {
        res.render('404')

    } catch (error) {
        res.redirect('/notFound')
    }
}


const loadUserLogin = async (req, res) => {
    console.log('Passport User:', req.user); // Logs user from Passport
    console.log('Session User:', req.session.user); // Logs custom session user
    
    try {
        // If either req.user (Passport) or req.session.user (custom session) exists
        if (req.user || req.session.user) {
            console.log('User found, redirecting to home page.');
            res.render('home',{
                suser:req.session.user,

            }); // Redirect to home page
        } else {
            const message = req.query.error || '';

            console.log('No user found, rendering login page.');
            res.render('login', { title: 'Login',message }); // Render login page
        }
    } catch (error) {
        console.error('Error loading login page:', error.message);
        res.status(500).send('Server error'); // Send server error response
    }
};






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
        res.redirect('/notFound')
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

const userLogin = async(req,res)=>{
    try {
        const {email,password} = req.body;
        console.log(req.body)

        const findUser = await userSchema.findOne({isAdmin:0,email:email});
        if(!findUser){
            return res.render('login',{message:"User not found"})
        }else
        if(findUser.isBlocked){
           return res.render('login',{message:"User is Blocked"}) 
        }

        const errorMessage = req.query.error || '';


        if(errorMessage){
            console.log('error,,,!',errorMessage);
            return res.render('login',{message:errorMessage}) 

        }

        const passwordMatch = await bcrypt.compare(password,findUser.password);
            console.log('match',passwordMatch)
        if(!passwordMatch){
            return res.render('login',{message:'Incorrect Password'})
        }

        req.session.user = findUser._id;
        // res.render('home',{
        //     suser:req.session.user,
        // user:req.user});

      res.redirect('/')


    } catch (error) {
        console.error('login error');
        res.render('login',{message:'Login failed , Please try again'})
    }

}




const loaduserHome = async (req, res) => {

    try {
        console.log('Passport User:', req.user); // Logs user from Passport
        console.log('Session User:', req.session.user); // Logs custom session user
        const userId = req.user ? req.user._id : req.session.user;

        const caetegories = await categorySchema.find({isListed:true})


let  productData = await productSchema.find({
 isBlocked:false,
//  status:"Available",
//  category:{$in:caetegories.map(category=>category._id)}
})
.sort({productName:1})

console.log('data-prod',productData);



productData.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
const productData1 = productData.slice(0,8)
const productData2 = productData.slice(8,16)

console.log("p1....",productData1);
console.log("p2....",productData2);


        if(userId){
         return   res.render('home',{
            user:userId,
            products1:productData1,
            products2:productData2,

         });

        }else if(req.session.user){
            return   res.render('home',{
                suser:req.session.user,
                products1:productData1,
                products2:productData2
    
            });
            

        }else{
            return res.render('home',{
                products1:productData1,
                products2:productData2    
            })
        }

    } catch (error) {
        console.error('Error loading home page:', error.message);
        res.status(500).send('Server error');
    }
};

// user profile
const userProfile = async(req,res)=>{
    try {

        res.render('profile')
        
    } catch (error) {
        console.error('Error loading home page:', error.message);
        res.status(500).send('Server error');
        
    }
}

// logout
const logout = async(req,res)=>{
    try {
        req.session.destroy((err)=>{
            if(err){
                console.log('session destroy error',err.message);
                return res.redirect('*');
                
            }
            return res.redirect('/login')
        })
    } catch (error) {
        console.log('logout error',error);
        res.redirect('/notFound')        
    }
}

const loadShopePage = async (req,res) => {
    try {

        const moment = require('moment');
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page-1)*limit;

        const caetegories = await categorySchema.find({isListed:true})


        let  productData = await productSchema.find({
         isBlocked:false,
        //  status:"Available",
         category:{$in:caetegories.map(category=>category._id)}
        })
        .sort({productName:1})
        .skip(skip)
        .limit(limit)

        const totalProducts = await productSchema.find({isBlocked:false})
        .countDocuments();


        const totalPages = Math.ceil(totalProducts/limit)

        res.render('shop',{
            product:productData,
            category:caetegories,
            suser:req.session.user,
            currentPage:page,
            totalPages:totalPages,
            moment,
            limit 

        })
        
    } catch (error) {
        console.log("Error...!",error);
        res.redirect('/')
    }
}










module.exports = {
    loaduserHome,
    erroPage,
    loadUserLogin,
    userSignUp,
    SignUp,
    verifyOTP,
    resendOtp,
    userLogin,
    userProfile,
    logout,
    loadShopePage
}