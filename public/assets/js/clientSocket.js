/**
 * socket would refer on client side
 */
var connected = false;

const socket = io('http://localhost:3000/');

var session = JSON.parse($(".local_data").val());
console.log(session);

socket.emit("setup", session);

socket.on("connected", () => connected = true);


socket.emit('login',session);

/*------Listner of Logged In User emit by server---------*/
socket.on('loginNotify',(user) => {
    $(".logged_in__"+user._id).show();  
    //$("#logged_in__"+user._id).show();
    
});

