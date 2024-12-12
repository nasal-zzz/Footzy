const userSchema = require('../../models/userSchema');


const adminAuth = (req,res,next)=>{
    userSchema.findOne({isAdmin:true})
    .then(data=>{
        // console.log("ddZ total",data);
        
        if(data){

            next()
           
        }else{
            
            res.redirect('/admin/login')
        }
    }).catch(error=>{
        console.log('error in admin middlewaare');
        res.status(500).send("Internal server error")
    })
}









const isLogin = (req,res,next)=>{
    if(req.session.admin){
        console.log("log admin auth",req.session.admin);
        next();

    }else{
        res.redirect('/admin/login')

    }
}





module.exports = {adminAuth,isLogin,}









