
const User          = require('../models/UserModel');
const bcrypt        = require('bcrypt');
//const passport      = require('../config/passport');

const passport = require("passport");
const path          = require('path');


exports.index = (req, res) => {

    res.render('pages/login', { title: 'Index Page' });
}

exports.register = (req, res) => {

    res.render('pages/register', { title: 'register Page'});
}

exports.registerpost = async (req, res) => {

    const { name,username, password ,email} = req.body;

    if(!name || !username || !password ){
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

exports.dashboard = async (req, res) => {

    //var session_data = req.session.user;
    console.log(req.user._id);

    /*------Get all registered User from DB-----------------*/
    const users = await User.find({ _id: { $ne: req.user._id } });

    try{
        var payload = {
            title:'All User',
            res:[],
            status:true
        }

    } catch(err){

        var payload = {
            title:'All User',
            res:'',
            status:true
        }
    }

    res.status(200).render('pages/dashboard', payload);
}


exports.logout = (req, res) => {

    req.logout();
    return res.redirect('/');
}


/**
 * Upload profile image on server
 */
exports.upload_profileImage = async (req, res,next) => {

    if(!req.file){
        console.log(req.file.croppedImage);
        res.status(400).send('uououiuouo');
    }
    
    var file_path = `/uploads/${req.file.filename}`;

    req.user = await User.findByIdAndUpdate(req.user._id, { pofile_pic: file_path}, { new: true });

    //res.status(200).send(req.user);
    res.sendStatus(204);  // Success but given no content
} 

exports.GetImagePath = (req,res) => {
    res.sendFile(path.join(__dirname, "../uploads/" + req.params.path));
}


