$(document).ready(function() {

    
    if (localStorage.getItem("uname") == null && localStorage.getItem("pword") == null ) {
        console.log("Username and Password is null");
    }else {
        console.log("Username and Password is set");
        var uname = localStorage.getItem("uname");
        var pword = localStorage.getItem("pword");

        $("#txtUsername").val(uname);
        $("#txtPasskey").val(pword);

    }

    $("#txtUsername, #txtPasskey").keyup(function() {
        $("#notif-account").css("display","none");
    })

    //Capture ajax request and show loading modal
    $.ajaxSetup({
        beforeSend: function() {
            //check connection string
            // show progress spinner
            $("body").addClass("loading"); 
        },
        complete: function() {
            // hide progress spinner
            $("body").removeClass("loading"); 
        }
    });

})



function setAccount() {
    var uname = $("#txtUsername").val();
    var pword = $("#txtPasskey").val();

    $.get(config.connString+"get",{action:"validateUserPass",uname:uname,pword:pword })
    .done(function(response,status){

        $("#lbl-constatus").html("Local").css("color","green");

        if (response == "1") {
            localStorage.setItem("uname",uname);
            localStorage.setItem("pword",pword);

            $("#modalLogin").modal();
        }else {
            $("#notif-account").css("display","block");
        }
    })
    .fail(function(){
        $("#lbl-constatus").html("No Connection").css("color","red");
        $("#modalCheckConnection").modal();
    })

}


function togglePassword() {
    var input = document.getElementById("txtPasskey");
    if (input.type === "password") {
        input.type="text";
    }else {
        input.type="password";
    }

}



function removeLocalStorage() {
    localStorage.clear();
}