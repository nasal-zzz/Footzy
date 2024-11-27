

const userSchema = require('../../models/userSchema')




const userAuth = (req, res, next) => {
    if (req.session.user) {
        userSchema.findById(req.session.user)
            .then(data => {
                if (data && !data.isBlocked) {
                    next();
                } else {
                    req.session.destroy(err => {
                        if (err) {
                            console.error("Error destroying session:", err);
                            res.status(500).send('Internal server error');
                        } else {
                            res.render('signup',{message:"You have been blocked for some reason...!"});
                        }
                    });
                }
            })
            .catch(error => {
                console.error("Error in user auth:", error);
                res.status(500).send('Internal server error');
            });
    } else {
        req.session.destroy(err => {
            if (err) {
                console.error("Error destroying session:", err);
                res.status(500).send('Internal server error');
            } else {
                // res.redirect('/login');
                res.render('signup',{message:"You have been blocked for some reason...!"});
            }
        });
    }
};






const checkSession = (req,res,next)=>{
    if(req.session.user){
        next();
    }else{
        res.redirect('/login')
    }
}



const isLogin = (req,res,next)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        next();
    }
}


module.exports = {checkSession,isLogin,userAuth}