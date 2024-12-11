const passport = require('passport');
const googleStrategy  = require('passport-google-oauth20').Strategy;
const env = require("dotenv").config();

const UserSchema = require('../models/userSchema');


passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('Profile:', profile.displayName);

                // Check if the user exists
                let user = await UserSchema.findOne({ googleId: profile.id });

                if (user) {
                    // Check if the user is blocked
                    if (user.isBlocked) {
                        console.log('Blocked user tried to login:', user.email);
                        return done(null, false, { message: "Your account is blocked." });
                    }
                    console.log('Existing user logged in:', user.email);
                    return done(null, user);
                } else {
                    // Create a new user
                    const newUser = new UserSchema({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        isBlocked: false // Default to not blocked
                    });

                    await newUser.save();
                    console.log('New user created:', newUser.email);
                    return done(null, newUser);
                }
            } catch (err) {
                console.error('Error during authentication:', err);
                return done(err, null);
            }
        }
    )
);


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