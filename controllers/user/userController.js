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

    console.log('Passport User:', req.user); 
    console.log('Session User:', req.session.user); 
    
    try {
        
        if (req.user || req.session.user) {
            console.log('User found, redirecting to home page.');
            res.render('home',{
                suser:req.session.user,
                title:'Home'

            }); // Redirect to home page
        } else {
            const message = req.query.error || '';

            console.log('No user found, rendering login page.');
            res.render('login', { title: 'Login',message });
        }
    } catch (error) {
        console.error('Error loading login page:', error.message);
        res.status(500).redirect('/notFound'); 
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
            return res.render('signup',{
                message:'User already exist!!',
                title:'Sign Up'
            })
        }

        const otp = generateOtp();

        const sentEmail = await sendVerificationEmail(email,otp);
        if(!sentEmail){
            return res.json("email-error")
        }
        

        req.session.userOtp = otp    
        req.session.userData = {email,password,username,phone,dob}

        res.render("otp",{eemail:email,title:'otp-verification'})
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
            return res.render('login',{message:"User not found",title:'Login'})
        }else
        if(findUser.isBlocked){
           return res.render('login',{message:"User is Blocked",title:'Login'}) 
        }

        const errorMessage = req.query.error || '';


        if(errorMessage){
            console.log('error,,,!',errorMessage);
            return res.render('login',{message:errorMessage,title:'Login'}) 

        }

        const passwordMatch = await bcrypt.compare(password,findUser.password);
            console.log('match',passwordMatch)
        if(!passwordMatch){
            return res.render('login',{message:'Incorrect Password',title:'Login'})
        }

        req.session.user = findUser._id;
        // res.render('home',{
        //     suser:req.session.user,
        // user:req.user});

      res.redirect('/')


    } catch (error) {
        console.error('login error');
        res.render('login',{message:'Login failed , Please try again',title:'Login'})
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
            cat:caetegories,
            title:'Home'
         });

        }else if(req.session.user){
            return   res.render('home',{
                suser:req.session.user,
                products1:productData1,
                products2:productData2,
                cat:caetegories,
                title:'Home'
    
            });
            

        }else{
            return res.render('home',{
                products1:productData1,
                products2:productData2,
                cat:caetegories,
                title:'Home'    
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
        const id = req.session.user
        
console.log("sessn user..../",id);

const user = await userSchema.findById(id)
console.log(" user..../",user);

        res.render('profile',{
            user:user,
            title:'Profile'
        })
        
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
                return res.redirect('/notFound');
                
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
        const limit = 9;
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
            limit,
            title:'Shoping',
            minPrice:0,   
            maxPrice:0,
            sortt:'All'
        })
        
    } catch (error) {
        console.log("Error...!",error);
        res.redirect('/')
    }
}


//forgot password

//get verify-email

const getVerifyEmail = async (req,res) => {
    try {
        res.render('verifyEmail',{title:"verify-Email"})
        
    } catch (error) {
        console.log('error',error);
        
    }
}


const verifyEmail = async (req,res) => {
    try {
const{email}= req.body;
console.log("emml..",email);

        const user = await userSchema.findOne({email:email,isAdmin:false})
        console.log("exist..!",user);

        if(!user){
            console.log("user not found...!");
            res.render('verifyEmail',{message:'User not exist..!, Please enter another Email',title:"verify-Email"})
            
        }else{


            const otp = generateOtp();

            const sentEmail = await sendVerificationEmail(email,otp);
            if(!sentEmail){
                return res.json("email-error")
            }

            req.session.userOtp = otp    
            req.session.userData = {email}

            setTimeout(function() {

        res.render('otp-forgotPass',{eemail:email,title:'otp-verification'})

    }, 2000);


        console.log("otp send",otp);
        console.log("to ",email);



        } 




    } catch (error) {
        console.log('server error', error);
        res.redirect('/notFound')
    }
}





const verifyForgotOTP = async (req, res) => {
    try {
      const { otp1 } = req.body;
      console.log(req.body);
      console.log('Received OTP:', otp1);
      console.log('Session OTP:', req.session.userOtp);
  
      // Compare OTPs as strings to avoid type issues
      if (String(otp1) === String(req.session.userOtp)) {
        const user = req.session.userData;

        console.log('session mail,,,',user);
        
        res.status(200).json({ success: true, redirectUrl: "/reset-password"});
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

const resendForgotOtp = async(req,res)=>{
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


// load reset password
const loadResetPassword = async (req,res) => {
    try {
        res.render('resetPassword')
    } catch (error) {
        console.log('error on loading reset password page',error);
        res.redirect('notFound')
    }
    
}

const resetPassword = async (req,res) => {
    try {
        const {email} = req.session.userData;
        console.log("mail'';",email);

        const {password,cpassword} = req.body;

        console.log("neww...",req.body);

        // const user = await userSchema.findOne({email:email})
        // console.log("usrr..",user);

        const hashPassword = await securePassword(password);
        console.log('Hashed password:', hashPassword);

        await userSchema.updateOne({email:email},{$set:{password:hashPassword}})
        
        console.log("password reseted ...!!");
        
        setTimeout(function() {

        res.redirect('/login')

    }, 2000);

        
    } catch (error) {
        console.log(error);
        res.redirect('/notFound')
        
        
    }
}



const filterProducct = async (req,res) => {
    try {
        const moment = require('moment');
        const page = parseInt(req.query.page) || 1;
        const limit = 9;
        const skip = (page - 1) * limit;

        const categoryId = req.query.categoryId;

        // Fetch all categories for the sidebar
        const categories = await categorySchema.find({ isListed: true });

        let filter = { isBlocked: false };

        // If categoryId is present, filter by category
        if (categoryId) {
            filter.category = categoryId;
        } else {
            // Show products from all listed categories
            filter.category = { $in: categories.map(cat => cat._id) };
        }

        // Fetch filtered products with pagination
        const productData = await productSchema.find(filter)
            .sort({ productName: 1 })  // Sort by product name
            .skip(skip)
            .limit(limit);

        // Calculate total products for pagination
        const totalProducts = await productSchema.find(filter).countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        req.session.filteredProducts = productData.map(product => product._id);


        // Render the shop page with filtered results and pagination
        res.render('shop', {
            product: productData,
            category: categories,
            suser: req.session.user,
            currentPage: page,
            totalPages: totalPages,
            moment,
            limit,
            minPrice : 0,
            maxPrice : 0,
            title: 'Shopping',
            sortt:'All'

        });

    } catch (error) {
        console.error("Error fetching filtered products: ", error);
        res.redirect('/');
    }
    
}


const filterByPrice = async (req,res) => {
    console.log('booooooooooooodyyyyyyyyyyyyyy',req.body);
    try {
        const moment = require('moment');

        console.log('inn..../');
        

        // Get page and limit from query, default to page 1, limit 9 per page
        const page = parseInt(req.query.page) || 1;
        const limit = 9;
        const skip = (page - 1) * limit;

        // Get price values from request body
        const minPrice = parseInt(req.body.minPrice) || 0;
        const maxPrice = parseInt(req.body.maxPrice) || 10000;

        // Filter products by price
        const filter = {
            isBlocked: false,
            salePrice: { $gte: minPrice, $lte: maxPrice }
        };

        // Fetch products with pagination
        const productData = await productSchema.find(filter)
            .sort({ productName: 1 })  // Sort alphabetically by product name
            .skip(skip)
            .limit(limit);

            console.log('prod filtr =',productData);

            req.session.filteredProducts = productData.map(product => product._id);

            

        // Calculate total products for pagination
        const totalProducts = await productSchema.find(filter).countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        const caetegories = await categorySchema.find({isListed:true})


        // Render filtered products
        res.render('shop', {
            product: productData,
            category:caetegories,
            suser: req.session.user,
            currentPage: page,
            totalPages: totalPages,
            minPrice:minPrice || 0,   
            maxPrice:maxPrice || 0,
            moment,
            limit,
            title: 'Shoping',
            sortt:'All'

        });

    } catch (error) {
        console.error("Error filtering products by price: ", error);
        res.redirect('/');
    }
    
}




const searching = async (req, res) => {
    try {
        const moment = require('moment');
        console.log('Search initiated...');
        console.log('Filtered products in session:', req.session.filteredProducts);

        const page = parseInt(req.query.page) || 1;
        const limit = 9;
        const skip = (page - 1) * limit;

        let search = req.body.query;

console.log('bdy==',search);


        let searchResult = [];

        if (req.session.filteredProducts && req.session.filteredProducts.length > 0) {
            const products = await productSchema.find({
                _id: { $in: req.session.filteredProducts }
            });

            searchResult = products.filter(product =>
                product.productName && product.productName.toLowerCase().includes(search.toLowerCase())
            );

        } else {
            // Direct DB search if no filtered products in session
            searchResult = await productSchema.find({
                productName: { $regex: ".*" + search + ".*", $options: "i" },
                isBlocked: false
            }).sort({ productName: 1 }).skip(skip);
        }

        console.log('Search result:', searchResult);

        const totalProducts = searchResult.length;
        const totalPages = Math.ceil(totalProducts / limit);

        const categories = await categorySchema.find({ isListed: true });

        const minPrice = req.body.minPrice || 0;
        const maxPrice = req.body.maxPrice || 0;

        res.render('shop', {
            product: searchResult,
            category: categories,
            suser: req.session.user,
            currentPage: page,
            totalPages: totalPages,
            minPrice,
            maxPrice,
            moment,
            limit,
            title: 'Shopping',
            sortt:'All'
        });

    } catch (error) {
        console.error("Error filtering products by price: ", error);
        res.redirect('/notFound');
    }
};




// const sorting = async (req, res) => {
//     try {
//         const moment = require('moment');
//         console.log('Search initiated...');
//         console.log('Filtered products in session:', req.session.filteredProducts);

//         const page = parseInt(req.query.page) || 1;
//         const limit = 9;
//         const skip = (page - 1) * limit;

//         const sort = req.query.sort || 'All';
//         let products;
//         let totalProductsCount;

//         switch (sort) {
//             case 'New Arrivals':
//                 totalProductsCount = await productSchema.countDocuments();
//                 products = await productSchema.find()
//                     .sort({ createdAt: -1 })
//                     .skip(skip)
//                     .limit(limit);
//                 break;
//             case 'Price : Low to High':
//                 totalProductsCount = await productSchema.countDocuments({ isBlocked: false });
//                 products = await productSchema.find({ isBlocked: false })
//                     .sort({ salePrice: 1 })
//                     .skip(skip)
//                     .limit(limit);
//                 break;
//             case 'Price : High to Low':
//                 totalProductsCount = await productSchema.countDocuments({ isBlocked: false });
//                 products = await productSchema.find({ isBlocked: false })
//                     .sort({ salePrice: -1 })
//                     .skip(skip)
//                     .limit(limit);
//                 break;
//             case 'Name : A to Z':
//                 totalProductsCount = await productSchema.countDocuments({ isBlocked: false });
//                 products = await productSchema.find({ isBlocked: false })
//                     .sort({ productName: 1 })
//                     .skip(skip)
//                     .limit(limit);
//                 break;
//             case 'Name : Z to A':
//                 totalProductsCount = await productSchema.countDocuments({ isBlocked: false });
//                 products = await productSchema.find({ isBlocked: false })
//                     .sort({ productName: -1 })
//                     .skip(skip)
//                     .limit(limit);
//                 break;
//             default:
//                 totalProductsCount = await productSchema.countDocuments({ isBlocked: false });
//                 products = await productSchema.find({ isBlocked: false })
//                     .skip(skip)
//                     .limit(limit);
//         }

//         const totalPages = Math.ceil(totalProductsCount / limit);
//         console.log('Total products:', totalProductsCount);
//         console.log('Total pages:', totalPages);

//         const minPrice = req.body.minPrice || 0;
//         const maxPrice = req.body.maxPrice || 0;


//         const categories = await categorySchema.find({ isListed: true });

//         res.render('shop', {
//             product: products,
//             category: categories,
//             suser: req.session.user,
//             currentPage: page,
//             totalPages: totalPages,
//             moment,
//             limit,
//             minPrice,
//             maxPrice,
//             title: 'Shopping',
//             sortt: sort
//         });

//     } catch (error) {
//         console.error("Error during sorting and pagination: ", error);
//         res.redirect('/notFound');
//     }
// };



const sorting = async (req, res) => {
    try {
        const moment = require('moment');
        console.log('Search initiated...');
        console.log('Filtered products in session:', req.session.filteredProducts);

        const page = parseInt(req.query.page) || 1;
        const limit = 9;
        const skip = (page - 1) * limit;

        const sort = req.query.sort || 'All';
        let products;
        let totalProductsCount;

        const sortOptions = {
            'New Arrivals': { createdAt: -1 },
            'Price : Low to High': { salePrice: 1 },
            'Price : High to Low': { salePrice: -1 },
            'Name : A to Z': { productName: 1 },
            'Name : Z to A': { productName: -1 }
        };

        const selectedSort = sortOptions[sort] || {};

        if (req.session.filteredProducts && req.session.filteredProducts.length > 0) {
            console.log("Sorting within filtered products...");

            totalProductsCount = req.session.filteredProducts.length;

            products = await productSchema.find({
                _id: { $in: req.session.filteredProducts }
            }).sort(selectedSort).skip(skip).limit(limit);

        } else {
            console.log("Sorting all products...");

            totalProductsCount = await productSchema.countDocuments({ isBlocked: false });

            products = await productSchema.find({ isBlocked: false })
                .sort(selectedSort)
                .skip(skip)
                .limit(limit);
        }

        const minPrice = req.body.minPrice || 0;
        const maxPrice = req.body.maxPrice || 0;

        const totalPages = Math.ceil(totalProductsCount / limit);
        console.log('Total products:', totalProductsCount);
        console.log('Total pages:', totalPages);

        const categories = await categorySchema.find({ isListed: true });

        res.render('shop', {
            product: products,
            category: categories,
            suser: req.session.user,
            currentPage: page,
            totalPages: totalPages,
            moment,
            limit,
            minPrice,
            maxPrice,
            title: 'Shopping',
            sortt: sort
        });

    } catch (error) {
        console.error("Error during sorting and pagination: ", error);
        res.redirect('/notFound');
    }
};






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
    loadShopePage,
    getVerifyEmail,
    verifyEmail,
    verifyForgotOTP,
    resendForgotOtp,
    loadResetPassword,
    resetPassword,
    filterProducct,
    filterByPrice,
    searching,
    sorting
}