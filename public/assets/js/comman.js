
/**
 * Define Global Variable
 */
var selected_user = [];

/**
 * Make an ajax Request on window load and get all registered user to show on left side bar
 */
$(document).ready(function(){

    //alert("hello");
    /* $.get("/api/GetUsers", response => {
        console.log(response);
        
        var html = createUserHtml(response);
        console.log(html);
        $(".chat-user-list").prepend(html);
    }); */
});

$(document).on('click', '.select_user', function () {

    alert("User selected");
});

function createUserHtml(response){

    $.each(response, function (key, val) {
        //alert(key + val);
        
        return  `<li>
                    <a href="#" class="select_user">
                        <div class="media">

                            <div class="chat-user-img online align-self-center mr-3">
                                <img src="assets/images/users/avatar-2.jpg" class="rounded-circle avatar-xs" alt="">
                                <span class="user-status"></span>
                            </div>

                            <div class="media-body overflow-hidden">
                                <h5 class="text-truncate font-size-15 mb-1">${val.name}</h5>
                                <p class="chat-user-message text-truncate mb-0">This is latest message</p>
                            </div>
                            <div class="font-size-11">05 min</div>
                        </div>
                    </a>
                </li>`

                //console.log(htnll);
    });
    
}

