
/**
 * Define Global Variable
 */
var selected_user = [];

/**
 * Make an ajax Request on window load and get all registered user to show on left side bar
 */
$(document).ready(function(){

    GetallUsers();
}); 

function GetallUsers(){
    $.get("/api/GetUsers", response => {
        //console.log(response);
        OutputfindUser(response, $(".chat-user-list"));
    })
}


function OutputfindUser(users,container){
    
    users.forEach(result => {

        /*---------Push the selected user's in selecteduser array-----------*/
        container.html();

        var html = createUserHtml(result);
        var element = $(html);
        container.append(element);
    }); 
}

function createUserHtml(response){

       if(response.pofile_pic){
            var image_html = `<img src="${response.pofile_pic}" class="rounded-circle avatar-xs" alt=""> `;
       } else {
            var image_html = `<div class="avatar-xs"><span class="avatar-title rounded-circle bg-soft-primary text-primary">${response.name.charAt(0)}</span></div>`
       }

        return `<li class="typing">
                    <a href="javascript:void();" class="select_user" data-id="${response._id}">
                        <div class="media">
                            <div class="chat-user-img online align-self-center mr-3">
                            ${image_html}
                            <span class="user-status logged_in__${response._id}" style="display:none;"></span>
                            </div>
                            <div class="media-body overflow-hidden">
                                <h5 class="text-truncate font-size-15 mb-1">${response.name}</h5>
                                <p class="chat-user-message text-truncate mb-0">This is latest message</p>
                            </div>
                            <div class="font-size-11">05 min</div>
                        </div>
                    </a>
                </li>`

}


$(document).on('click', '.select_user', function () {

    var user = $(this).attr("data-id");

     /*-----Ajax Request to save the Post-----*/
    $.post("/api/chat/create", { user: user }, (response, status, xhr) => {
        console.log(response);
        /* if(status =='success' && xhr.status ==200){
            console.log("inside");
        } */
        if(response._id){
            window.location.href = `/chat/${response._id}`;
        } else {
            toastr.fail('No Response from Server');
        }
    })
});


/**
 * Profile photo upload event
 */

$("#filePhoto").change(function() {
    console.log("clicked");
    readURL(this);
});


function readURL(input) {

    if (input.files && input.files[0]) {
      var reader = new FileReader();

      $('#imageUploadModal').modal('show');
      
      reader.onload = function(e) {
        //console.log( e.target.result);
        $('#imagePreview').attr('src', e.target.result);

        var imagePreview = document.getElementById("imagePreview");
        var imageSrc = e.target.result;

        cropper = new Cropper(imagePreview,{
            aspectRatio: 1 / 1,
            background: false
        });

      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    } else {
        console.log("nope");
    }
}

$("#imageUploadButton").click(() => {
    
    // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`.
    // The default value for the second parameter of `toBlob` is 'image/png', change it if necessary.
    cropper.getCroppedCanvas().toBlob((blob) => {

        const formData = new FormData();
    
        // Pass the image file name as the third parameter if necessary.
        formData.append('croppedImage', blob/*, 'example.png' */);
    
        // Use `jQuery.ajax` method for example
        $.ajax('/upload_profileImage', {
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success() {
                console.log('Upload success');
                location.reload()
            },
            error() {
                console.log('Upload error');
            },
        });
    }/*, 'image/png' */);

});

$(document).ready(function(event) {
    $("#emojionearea2").emojioneArea({
        pickerPosition: "top",
        tonesStyle: "radio"
    });
});


 