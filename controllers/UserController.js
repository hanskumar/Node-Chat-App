const Swal          = require('sweetalert2');
const User          = require('../models/UserModel');

const bcrypt        = require('bcrypt');
//const passport      = require('../config/passport');

const passport = require("passport");


exports.index = (req, res) => {

    res.render('pages/login', { title: 'Index Page' });
}

exports.register = (req, res) => {

    res.render('pages/register', { title: 'register Page'});
}

exports.registerpost = async (req, res) => {

    const { name,username, password ,email} = req.body;

    if(!name || !username || !password || !email){
        req.flash('error_msg', 'All filed are Required!');
        res.redirect('back')
    } 


    /*------------Username is exist---------------*/
     User.exists({username:username},(err,result) =>{

        if(result){
            req.flash('error_msg', 'Username already Exist');
            res.redirect('back')
        }
     });

     //----Save User

     const hashPassword = await bcrypt.hashSync(password, 10);

     const user = new User({
        name,username,email,
        password:hashPassword
     });

     user.save().then((user)=>{

        req.flash('success_msg', 'Registration suscussfully');
        res.redirect('/');

     }).catch(err =>{

        req.flash('error_msg', 'Something Went Wrong please try again');
        res.redirect('back');
     })
}

/* exports.login = async (req, res) => {
   
    const { username, password } = req.body;

    if(!username){
        res.redirect('back') 
    }

    const user = await User.findOne({
        username,
        password: password,
    });

    try{

        //----- If User found then login--------------//
        if (user) {

            req.session.isLoggedIn = true;    
            req.session.user  = user;

            //console.log(req.session);

            res.redirect('/dashboard');

        } else {
            //throw "Invalid Login Crediantioals"
            console.log("Invalid Login Crediantioals");
            res.redirect('/');
        }

    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
} */

exports.login = (req, res,next) => {
   
    const { username, password } = req.body;

    if(!username || !password){
        req.flash('error_msg', 'All filed are Required!');
        return res.redirect('/')
    }

    passport.authenticate('local', (err,user,info) => {

        if(err){
            req.flash('error_msg', info.message);
            return next(err)
        }

        if(!user){
            req.flash('error_msg', info.message);
            return res.redirect('/');
        }

        req.logIn(user,(err)=>{
            if(err){
                req.flash('error_msg', info.message);
                return next(err)
            }
            return res.redirect('/dashboard');
        });

    })(req,res,next)
}

exports.dashboard = (req, res) => {

    //var session_data = req.session.user;
    console.log(req.session);

    res.render('pages/dashboard', { title: 'dashbaord Page',session: req.session});
}


exports.logout = (req, res) => {

    req.logout();
    return res.redirect('/');
}

