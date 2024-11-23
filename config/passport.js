const passport = require('passport');
const googleStrategy  = require('passport-google-oauth20').Strategy;
const env = require("dotenv").config();

const UserSchema = require('../models/userSchema');


passport.use(new googleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL :"/google/callback"
},


async (accessTocken,refreshToken,profile,done)=>{
    try {
        console.log('prof',profile.displayName)
        let user = await UserSchema.findOne({googleId:profile.id});
        if(user){
            console.log('exist...!',profile.emails[0]);
            
            return done(null,user)
        }else{
         const user = new UserSchema({
                username : profile.displayName,
                email : profile.emails[0].value,
                googleId : profile.id
            });

            await user.save();

            return done(null,user);
        }


    } catch (err) {
        return done(err,null)
    }
}

))

passport.serializeUser((user,done)=>{

    done(null,user.id)
   
})


passport.deserializeUser((id,done)=>{

    UserSchema.findById(id)
    .then(user=>{
        done(null,user)
    }).catch(err =>{
        done(err,null)
    })
})


module.exports = passport;