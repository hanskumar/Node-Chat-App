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


    function scrollToBottom() {
        messageArea.scrollTop = messageArea.scrollHeight
    }

