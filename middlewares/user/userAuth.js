

const userSchema = require('../../models/userSchema')


const userAuth = (req,res,next)=>{
    if(req.session.user){
        userSchema.findById(req.session.user)
        .then(data=>{
            if(data && !data.isBlocked){
                next();
            }else{
                res.redirect('/login')
            }
        })
        .catch(error=>{
            console.log("error in user auth ....!");
            req.status(500).send('Internal server error')

        })
    }else{
        res.redirect('/login')
    }
}







const checkSession = (req,res,next)=>{
    if(req.session.user){
        next();
    }else{
        res.redirect('/login')
    }
}


const isLogin = (req,res,next)=>{
    if(req.session.user){
        res.redirect('/home')
    }else{
        next();
    }
}


module.exports = {checkSession,isLogin,userAuth}