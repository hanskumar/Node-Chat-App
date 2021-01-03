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
const users = {};
io.on("connection", (socket)=>{

    console.log('connection with socket.io, completed');

    let user_id = socket.handshake.query.user_id; // GET USER ID
        
    if (!users[user_id]) users[user_id] = [];

    // PUSH SOCKET ID FOR PARTICULAR USER ID
    users[user_id].push(socket.id);

    // USER IS ONLINE BROAD CAST TO ALL CONNECTED USERS
    io.sockets.emit("online", user_id);


    
    
    //socket.emit('message','Welcome Message')

        /*-----Broadcast a msg to every new user execpt to new joiner-----*/    
        //socket.broadcast.emit('message','A New user has Joind!')


        /* socket.on('sendMessage',(msg)=>{
            console.log(msg);
            io.emit('message',msg)
        }); */

        /* socket.on('disconnect',()=>{
            io.emit('message','A User has left')
        }) */

        socket.on('login', function(data){
            console.log('a user ' + data.userId + ' connected');
            // saving userId to object with socket ID
            users[socket.id] = data.userId;
        });

        socket.on('disconnect', function(){
            console.log('user ' + users[socket.id] + ' disconnected');
            // remove saved socket from users object
            delete users[socket.id];
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