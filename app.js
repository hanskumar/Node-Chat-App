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

/*-----Required DB---------*/
require('./config/dbConnect')();


/* mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}) */


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

const users = {};
//*=================Chat System Code Start Here=================*/
io.on("connection", (socket)=>{

    console.log('connection with socket.io, completed');

    /*-------Event Listner when someone join the chat------------*/
    socket.on("setup", userData => {
        socket.join(userData._id);
        socket.emit("connected");
        console.log("user logged In "+ userData.name);
    });

   /*------Listner when user join the chat----------*/    
   socket.on("JoinChat", chatroom => {
        console.log("user join the chat "+chatroom);
        socket.join(chatroom);
    });

    //Someone is typing Listner
    socket.on("typing", chatRoomData => { 
        //console.log("Chat IDD"+chatRoomData.ChatID);
        /*-----Emit typing event to client in specific room--------*/
        socket.in(chatRoomData.ChatID).emit("notifyTyping",chatRoomData);
    }); 

    //Someone is Stoptyping Listner
    socket.on("stopTyping", chatRoom => { 
        //console.log("Chat IDD"+chatRoomData.ChatID);
        /*-----Emit typing event to client in specific room--------*/
        socket.in(chatRoom).emit("notifyStopTyping","");
    }); 

    //---Message Listner    
    socket.on('message', (MsgData) => {
        //console.log(`msg : ${MsgData.message}`);

        //console.log(`MsgData : ${MsgData}`);
        socket.in(MsgData.ChatID).emit("message",MsgData);

    });

    socket.on('login', function(data){
        console.log('a user ' + data._id + ' connected');
        //console.log(data._id);
        // saving userId to object with socket ID
        //users[socket.id] = data.userId;

        users[socket.id] = data._id;

        console.log(users);

        /*-----Broadcast a msg to every new user execpt to new joiner-----*/    
        socket.broadcast.emit('loginNotify',data)
    });

    socket.on('bang', function(){
        console.log('bang');
        io.emit('play');
    });

});

//*=================Chat System Code END Here=================*/
app.use((req, res, next) => {
    //res.locals.user    = req.user;

    res.locals.session    = req.user || '';

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg  = req.flash('error_msg');
    next();
});

//*=================System Routes Define Here==========================
/* All routes Which are not Required loged in/authantication*/
app.use('/',require("./routes/Routes"));


app.use('/api',require("./routes/api/ApiRoutes"));

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.render('error/404', { title: res });
}); 


module.exports = app;