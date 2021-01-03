const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/UserModel');

const bcrypt        = require('bcrypt');

module.exports =  function(passport) {

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    async (username, password, done) =>{
        // Check Username exist in db
        const user = await User.findOne({username})
        if(!user){
            return done(null,false,{message:'User not found'});
        }

        // If user found
        if(user){

            const match = await bcrypt.compare(password, user.password);
            try{
                if(match) {
                    return done(null,user,{message:'Logged in succussfully'});
                }
                return done(null,false,{message:'Wrong username or Password'});

            } catch (err) {
                //console.log(err);
                return done(null,false,{message:'Somthing went wrong'});
            }
        }
    }

    ));

    // used to serialize the user for the session
    passport.serializeUser((user, done)=> {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser((id, done)=> {

        User.findById({_id:id},(err,user)=>{
            done(err, user);
        });
    });

}