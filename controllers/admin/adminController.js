const userSchema = require('../../models/userSchema')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')



const loadLogin = async (req,res) => {
        
        if(req.session.admin){
            return res.redirect("/admin/dashboard")
        }
        res.render('adminLogin')
        console.log('hiiiiiiiii');
        

   
} 

const adminLogin = async(req,res)=>{
    try {
        const {email,password} = req.body;
        console.log("bd",req.body);
        
        const admin = await userSchema.findOne({email,isAdmin:true});
        console.log("ad",admin);
        

        if(!admin){
            return res.render('adminLogin',{message:'Invalid credentials'}) // admin not exist then rendering the same page with error message

        }

        const passwordMatch = await bcrypt.compare(password,admin.password);
        console.log("pp",passwordMatch);
        
        if(!passwordMatch){
            return res.render('adminLogin', {message:'Incorrect password'})

        }

       req.session.admin = true;
       res.redirect('/admin/dashboard')

    } catch (error) {
        console.log('login error',error);
        return res.redirect('/notFound')
        
    }
}

const loadDashboard = async (req,res) => {
    if(req.session.admin){

    try {
        res.render('dashboard')    
        
    } catch (error) {
        res.render('/notFound')
    }
}

}













module.exports = {loadLogin,adminLogin,loadDashboard}