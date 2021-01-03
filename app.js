const express       = require('express')
const app           = express();
const path          = require('path');
const dotenv        = require('dotenv');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const cookieParser  = require('cookie-parser');
const session       = require('express-session');
//const Swal          = require('sweetalert2');
const ejs           = require('ejs');
var flash           = require('connect-flash');
const toastr        = require("express-toastr");

const passport      = require("passport");


require("dotenv").config();
//app.use( express.static( "public" ) );

/*-----Connect to DB----------*/
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})


// view engine setup
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//app.set('views', path.join(__dirname, 'views'));


app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid', 
    secret: "etewtekeyboard564564", 
    resave: false, 
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 *24 } //24 hours
}));

//-----Passport Config---------
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session())


app.use(flash(app));
app.use(toastr());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

//Swal.fire('Hello world!')


const server = app.listen(3000, () => console.log(`Server is stated on http://localhost:3000`));

const io = require('socket.io')(server)

//*=================Chat System Code Start Here=================*/
let totalCount = 0;
//const users = {};
io.on("connection", (socket)=>{

    console.log('connection with socket.io, completed');

    /*-------------Listner when user discount-------*/
    socket.on("disconnect", function() {
        console.log("user disconnected");
    }); 

    //---Listner    
    socket.on('message', (msg) => {
        console.log(`msg : ${msg}`);
        socket.broadcast.emit('message', msg)
    });

    //Someone is typing Listner
    socket.on("typing", data => { 
        console.log(data);
        socket.broadcast.emit("notifyTyping", { user: data.user, message: data.message }); 
    }); 

    //when soemone stops typing Listner
    socket.on("stopTyping", () => {
        console.log("stop Typing Listner");
        socket.broadcast.emit("notifyStopTyping");
    });

});

//*=================Chat System Code END Here=================*/


app.use((req, res, next) => {
    //res.locals.session    = req.session;
    res.locals.user    = req.user;

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg  = req.flash('error_msg');
    next();
});

//*=================System Routes Define Here==========================
/* All routes Which are not Required loged in/authantication*/
app.use('/',require("./routes/Routes"));

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.render('error/404', { title: res });
}); 



module.exports = app;