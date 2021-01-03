/**
 * socket would refer on client side
 */

const socket = io('http://localhost:3000/');

let textarea = document.querySelector('#textarea');

let messageArea = document.querySelector('.message__area');

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    } 
})

function sendMessage(message){

    let msg = {
        user: 'Harpreet',
        message: message.trim()
    }

    // Append Message
    appendMessage(msg, 'outgoing');

    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg);
}

//--------Append msg to Chat Area (message__area Div)
function appendMessage(msg,eventType){
    let mainDiv = document.createElement('div')
    let className = eventType
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}


// Recieve from server messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});


//Someone is typing...
let messageInput = document.getElementById("textarea");
let typing = document.getElementById("typing");

//isTyping event
messageInput.addEventListener("keypress", () => {
  socket.emit("typing", { user: "Someone", message: "is typing..." });
});

socket.on("notifyTyping", data => {
    typing.innerText = data.user + " " + data.message;
    console.log(data.user + data.message);
});

//stop typing
messageInput.addEventListener("keyup", () => {
    console.log("stop Typing");
    socket.emit("stopTyping", "");
});

//stop typing listner
socket.on("notifyStopTyping", () => {
    typing.innerText = "";
});


function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}

