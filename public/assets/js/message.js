/* var mySound = new Audio("/public/assets/audio/noti.mp3");
mySound.load(); */

/**
 * Send Message event Handler
 */
    $(".sendMessageButton").click((e) => {

        var message = $('.typing_box').val().trim();  
        var ChatID = $('.chatID').val().trim(); 

        console.log(message+'---------'+ChatID);
        /* if(!message || !ChatID){
            sendMessages(message,ChatID);
        } else {
            console.log("hello");
        } */

        sendMessages(message,ChatID);

    });

    $(document).keydown(function(event){
        var message = $('.typing_box').val().trim();  
        var ChatID = $('.chatID').val().trim(); 

        var session = JSON.parse($(".local_data").val());

        //Emit Typing event to the server
        var emitData = { user: session.name, message: "is typing" ,ChatID:ChatID, profile:session.pofile_pic}
        socket.emit("typing", emitData);

        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            if(!message =='' || !ChatID ==''){
                sendMessages(message,ChatID);

                /*-----Emit messese event to server------*/
                var msg_emitting_data = {message:message,ChatID:ChatID}
                socket.emit('message', msg_emitting_data);

                /*----Emit Soud Event to Server -----*/
                socket.emit('bang',msg_emitting_data); 

            }
            return false;	
        }
    });

    $(document).keyup(function(event){
        var ChatID = $('.chatID').val().trim();

        setTimeout(function(){
            //Emit stop Typing event to the server
            socket.emit("stopTyping", ChatID);
        }, 2000); 
    });

    $(document).ready(function(){

        var session = JSON.parse($(".local_data").val());
        //console.log(session);

        var ChatID = $('.chatID').val().trim(); 

        /*------Emit an Event when user join the chat-----------*/
        socket.emit("JoinChat", ChatID);

        /*------Listner of Typing Event emit by server---------*/
        socket.on('notifyTyping',data => {
            $(".typingDots").show();
            var typing_html = `<div class="conversation-list">
                                <div class="chat-avatar">
                                    <img src="/assets/${data.profile}" alt="${data.user}">
                                </div>
                                <div class="user-chat-content">
                                    <div class="ctext-wrap">
                                        <div class="ctext-wrap-content">
                                            <p class="mb-0">
                                                typing
                                                <span class="animate-typing">
                                                    <span class="dot"></span>
                                                    <span class="dot"></span>
                                                    <span class="dot"></span>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="conversation-name">${data.user}</div>
                                </div>
                            </div>`

            $(".typingDots").html(typing_html);    
        });

        /*------Listner of Typing Event emit by server---------*/
        socket.on('notifyStopTyping',() => {
            $(".typingDots").hide();
            $(".typingDots").html();    
        });

        // Recieve from server messages 
        socket.on('message', (msg) => {
            //appendMessage(msg, 'incoming');

            console.log("message reciver event on client side::"+ msg.message);

            var outhtml = CreateMessageHtml(msg,'','message');

            var container = $(".chatContainer");
            DisplayMessage(outhtml,container);

        // scrollToBottom();
        });

        /*----------Recieven server play emit--------*/
        socket.on('play', (rcvData) => {
            playAudio();   
        }); 

    });


/**
 * Send Message API
 * MsgType : audio,vedio,text
 */
    function sendMessages(message,ChatID,MsgType=''){

        if(message !=''){

            $.post("/message/send", { message: message,ChatID:ChatID,MsgType:MsgType}, results => {

                /*------Check if Message saved succssfully-----*/

                var outhtml = CreateMessageHtml(results,'right','message');

                var container = $(".chatContainer");
                DisplayMessage(outhtml,container);
                
                $('.typing_box').val('');
            });
        }
    }

    function CreateMessageHtml(response,msg_type,media_type) {

        if(media_type == 'media'){
            return `<li class="list-inline-item message-img-list">
                <div>
                    <a class="popup-img d-inline-block m-1" href="assets/images/small/img-1.jpg" title="Project 1">
                        <img src="assets/images/small/img-1.jpg" alt="" class="rounded border">
                    </a>
                </div>
            </li>`

        } else if(media_type =='message') {

            return `<li class="${msg_type}">
                    <div class="conversation-list">
                        <div class="user-chat-content">
                            <div class="ctext-wrap">
                                <div class="ctext-wrap-content">
                                    <p class="mb-0">${response.message}</p>
                                    
                                    <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">10:02</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>`
        }
    }

    function DisplayMessage(outhtml,container) {
        
        container.append(outhtml);
        //scrollToBottom();
    }

    function scrollToBottom() {
        $(".chatContainer").scrollTop = $(".chatContainer").scrollHeight
    }

/**
 * File upload in chat stream
 *
 */
    $(".media_attachment").change(function() {
        //console.log("clicked");
        var file = this.files[0];

        var ChatID = $('.chatID').val().trim(); 

        const formData = new FormData();
        formData.append('media_attachment', file, file.name);
        formData.append('ChatID',ChatID);

        $.ajax('/media_attachment', {
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success(response) {
                console.log(response);

                var outhtml = CreateMessageHtml(response,'right','media');

                var container = $(".chatContainer");
                DisplayMessage(outhtml,container);
            },
            error() {
                console.log('Upload error');
            },
        });

    });

    /*---------Sound Paly Function-------*/
    async function playAudio() {
        var sound = new Audio('/assets/audio/message.mp3'); 
        sound.type = 'audio/wav';
        try {
          await sound.play();
          console.log('Playing...');
        } catch (err) {
          console.log('Failed to play...' + err);
        }
    }
    
    $(document).ready(function(){

        $(".voice_recoder").on("click", function(){
           /*  let recoder_controlls_container = $("#recoding-controll-container");  
            RecordingControlls(recoder_controlls_container); */

            $("#media_container").hide();
            $("#recoding-controll-container").show();

            Start_recoding();

            startTimer();
        });

        $(".recording_done").on("click", function(){
          
            $("#media_container").show();
            $("#recoding-controll-container").hide();

            Stop_recording();
        });

    });


/**
 * JS code to Start/Stop Voice Audio Record
 */

let chunks = [];
let recorder;
var timeout;

var ChatID = $('.chatID').val().trim();

function Start_recoding(){

    let device = navigator.mediaDevices.getUserMedia({ audio: true });
    device.then(stream => {
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = e => {
            chunks.push(e.data);

            if (recorder.state == 'inactive') {
                let blob = new Blob(chunks, { type: 'audio/webm' });
                //document.getElementById('audio').innerHTML = '<source src="' + URL.createObjectURL(blob) + '" type="video/webm" />'; //;
                var reader = new FileReader();

                //---------------Call send Message function to save voice msg to db--------------//   
                reader.onload = function(event) {
                    $.ajax({
                        type: 'POST',
                        url: '/save/audio',
                        data: {
                          audio: event.target.result,ChatID:ChatID
                        }, 
                      }).done(function(data) {
                          //console.log(data);
                          var outhtml= CreateMediaContent(data,'audio','right'); 
                          
                          var container = $(".chatContainer");
                          DisplayMessage(outhtml,container);
                      });
                };

                reader.readAsDataURL(blob);
            }  
        }
        recorder.start(1000);
    });
   /*  setTimeout(() => {
        recorder.stop()
    }, 4000);  */
}

function Stop_recording(){
    recorder.stop();
    console.log("recoding stop");
}


function CreateMediaContent(data,mediaType,msg_type){

        return `<li class="${msg_type}">
                <div class="conversation-list">
                
                <div class="user-chat-content">
                    <div class="ctext-wrap">
                        <div class="ctext-wrap-content">
                            <audio src="${data.media_content}"  id="audio"  type="video/webm" controls> </audio>
                            <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">10:02</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </li>`;
}


/**
 * Vedio Recording Functions
 * 
 */

    let preview = document.getElementById("preview");
    let recording = document.getElementById("recording");
    let startButton = document.getElementById("start_video_recoder");
    let stopButton = document.getElementById("stopButton");
    let downloadButton = document.getElementById("downloadButton");
    let logElement = document.getElementById("log");

    let recordingTimeMS = 5000;

    function startVedioRecording(){

        let recorder = new MediaRecorder(stream);
        let data = [];

        recorder.ondataavailable = event => data.push(event.data);
        recorder.start();
        log(recorder.state + " for " + (lengthInMS/1000) + " seconds...");

        let stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve;
            recorder.onerror = event => reject(event.name);
        });

        let recorded = wait(lengthInMS).then(
            () => recorder.state == "recording" && recorder.stop()
        );

        return Promise.all([
            stopped,
            recorded
        ])
        .then(() => data);
    }

    
    function stop(stream) {
        stream.getTracks().forEach(track => track.stop());
    }


    startButton.addEventListener("click", function() {
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        }).then(stream => {
          preview.srcObject = stream;
          downloadButton.href = stream;
          preview.captureStream = preview.captureStream || preview.mozCaptureStream;
          return new Promise(resolve => preview.onplaying = resolve);
        }).then(() => startRecording(preview.captureStream(), recordingTimeMS))
        .then (recordedChunks => {
          let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });


          

          recording.src = URL.createObjectURL(recordedBlob);
          

          downloadButton.href = recording.src;
          downloadButton.download = "RecordedVideo.webm";
      
          log("Successfully recorded " + recordedBlob.size + " bytes of " +
              recordedBlob.type + " media.");
        })
        .catch(log);
      }, false);
      stopButton.addEventListener("click", function() {
        stop(preview.srcObject);
      }, false);


function startTimer(){
    var counter = 10;
    setInterval(function() {
      counter--;
      if (counter >= 0) {
        span = document.getElementById("elsaps_time");
        span.innerHTML = counter +' Sec';
      }
      if (counter === 0) {
          //alert('sorry, out of time');
          clearInterval(counter);
          Stop_recording();

          $("#media_container").show();
          $("#recoding-controll-container").hide();
      }
    }, 1000);
}