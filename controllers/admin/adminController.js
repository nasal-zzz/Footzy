const userSchema = require('../../models/userSchema')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const pageError = async (req,res) => {
    res.render('admin-404')
}


const loadLogin = async (req,res) => {
        
        if(req.session.admin){
            return res.redirect("/admin/dashboard")
        }else{
        res.render('adminLogin')
        console.log('hiiiiiiiii');
        
        }
   
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
     console.log('admin extst');
     
        const passwordMatch = await bcrypt.compare(password,admin.password);
        console.log("pp",passwordMatch);
        
        if(!passwordMatch){
            return res.render('adminLogin', {message:'Incorrect password'})

        }
        console.log('password match');
        

       req.session.admin = admin;
       console.log(req.session.admin ,'aDMIN................!!!')

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


const logout = async(req,res)=>{

        try {
            
            req.session.destroy(err =>{
                if(err){
                    console.log("error destroying session..!",err);
                    return res.redirect('/notFound');
                    
                }else{
                console.log("heyy..!");
                
                res.redirect('/admin/login')
                }
            })  

        } catch (error) {
            console.log("unexpected error on logout...!");
            res.redirect('/notFound');
            
        }
}















module.exports = {loadLogin,adminLogin,loadDashboard,pageError,logout}