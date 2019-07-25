var interval = null;

$(document).ready(function() {

    if (localStorage.getItem("uname") == null && localStorage.getItem("pword") == null ) {
        console.log("Username and Password is null");

        $("#modalNotification").modal();

    }else {
        console.log("Username and Password is set");
        var uname = localStorage.getItem("uname");
        var pword = localStorage.getItem("pword");

        //Check connection string if null every 0.5s;
        //Sometimes confing.connString is not rendered yet in function.js
        interval = setInterval(function(){
            if (config.connString != "") {
                clearInterval(interval);

                //Show records of user
                showRecords(uname,pword);
            }
        },250);
        
    }




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




function showRecords(username,passkey) {

    // var username = $("#txtUsername").val();
    // var passkey = $("#txtPasskey").val();
    $("#tblEmployeesLeaves tbody").empty();
    $("#tblEmployeesObt tbody").empty();
    
    $.post(config.connString+"post",{action:"validateUser",username:username,passkey:passkey})
    .done(function(response,status){
       
        if (status == "success") {
            
            if (response == "invalidaccount") {
                console.log("Invalid Account");
                // $("body").removeClass("loading"); 
                $("#notif-account").css("display","block");
            }else {
                //console.log(response);
                if (response.length > 1) {
                    var result = JSON.parse(response);
                    $("#tblEmployeesLeaves tbody").empty();

                    $.each(result,function(i,field) {
                        $("#tblEmployeesLeaves tbody").append('<tr>'+
                        '<td><input type="checkbox" class="form-control" /></td>'+
                        '<td>'+field["firstname"]+' '+field["lastname"]+'</td>'+
                        '<td>'+field["appliedleave"]+'</td>'+
                        '<td style="text-align:center;"><a href="javascript:void(0)" onclick="showModalLeave(\''+field["transcode"]+'\')" class="btn btn-sm btn-primary" ><i class="fa fa-bars"></i></a></td>'+    
                        '</tr>');
                        
                    })
                }
                //Load Official Business Trips
                loadObt(username);
            }
        }
        
    })
    .fail(function() {
        $("#lbl-constatus").html("No Connection").css("color","red");
        $("#modalCheckConnection").modal();
    }
    )
}




function loadObt(username) {
    
    $.post(config.connString+"post",{action:"loadObt",username:username},function(response,status){
        if (status == "success") {
            // $("body").removeClass("loading"); 
            $("#tblEmployeesObt tbody").empty();
            if (response.length > 1) {

                var result = JSON.parse(response);
                $.each(result,function(i,field) {
                    $("#tblEmployeesObt tbody").append('<tr>'+
                    '<td><input type="checkbox" class="form-control" /></td>'+
                    '<td>'+field["firstname"]+' '+field["lastname"]+'</td>'+
                    '<td>'+field["destination"]+'</td>'+
                    '<td><a href="javascript:void(0)" onclick="showModalObt(\''+field["transcode"]+'\')" class="btn btn-sm btn-primary" ><i class="fa fa-bars"></i></a> </td>'+
                    '</tr>');
                })
            }
        }
    })
}




//Popup modal leave action
function showModalLeave(transcode) {
    $.post(config.connString+"post",{action:"getLeaveInfo",transcode:transcode})
    .done(function(response,status) {
        $("#lbl-constatus").html("Local").css("color","green");

        var result = JSON.parse(response);
        $.each(result,function(i,field) {
            $("#leaveinfoName").html(field["firstname"] + " " + field["lastname"]);
            $("#leaveinfoReason").html(field["reasons"]);
            $("#leaveTranscode").val(field["transcode"]);
        })

        $("#modalLeave").modal();

    })
    .fail(function(){
        $("#lbl-constatus").html("No Connection").css("color","red");
        $("#modalCheckConnection").modal();
    })



}



//Update leave transaction
function updateLeaveTrans() {
    var approved = $("#selectLeaveAction").val();
    var transcode = $("#leaveTranscode").val(); 
    var notesreason = $("#leavenote").val();

    $.post(config.connString+"post",{action:"updateLeaveTrans",approved:approved,transcode:transcode,notesreason:notesreason})
    .done(function(response,status) {
        $("#lbl-constatus").html("Local").css("color","green");

        $("#leavenote").val("");
        loadRecords();
    })
    .fail(function(){
        $("#lbl-constatus").html("No Connection").css("color","red");
        $("#modalLeave").modal('toggle');
        $("#modalCheckConnection").modal();
        
    });
}



//Popup modal obt action
function showModalObt(transcode) {

    $.post(config.connString+"post",{action:"getObtInfo",transcode:transcode})
    .done(function(response,status) {
        $("#lbl-constatus").html("Local").css("color","green");

        var result = JSON.parse(response);
        $.each(result,function(i,field) {
            $("#obtinfoName").html(field["firstname"] + " " + field["lastname"]);
            $("#obtinfoDestination").html(field["destination"]);
            $("#obtinfoPurpose").html(field["purpose"]);
            $("#obtTranscode").val(field["transcode"]);

        })
        $("#modalObt").modal();

    })
    .fail(function(xhr,status, error) {
        $("#lbl-constatus").html("No Connection").css("color","red");
        $("#modalCheckConnection").modal();
    })

}


//Update OBT Transaction
function updateObtTrans() {
    var username = $("#txtUsername").val();
    var approved = $("#selectObtAction").val();
    var transcode = $("#obtTranscode").val();
    var notesreason = $("#obtnote").val();

    $.post(config.connString+"post",{action:"updateObtTrans",approved:approved,transcode:transcode,notesreason:notesreason})
    .done(function(response,status) {
        $("#lbl-constatus").html("Local").css("color","green");
        
        $("#modalObt").modal('toggle');
        loadObt(username);
    })
    .fail(function() {
        $("#modalObt").modal('toggle');
        $("#lbl-constatus").html("No Connection").css("color","red");
        $("#modalCheckConnection").modal();
    })


}





//Load leave pending records
function loadRecords() {
    // var username = $("#txtUsername").val();
    // var passkey = $("#txtPasskey").val();
    var username = localStorage.getItem("uname");
    var passkey = localStorage.getItem("pword");

    $("#tblEmployeesLeaves tbody").empty();
    $("#tblEmployeesObt tbody").empty();

    $.post(config.connString+"post",{action:"loadLeavePending",username:username,passkey:passkey},function(response,status){
        // console.log(response);
        var result = JSON.parse(response);
        $("#tblEmployeesLeaves tbody").empty();

        $.each(result,function(i,field) {
            $("#tblEmployeesLeaves tbody").append('<tr>'+
            '<td><input type="checkbox" class="form-control" /></td>'+
            '<td>'+field["firstname"]+' '+field["lastname"]+'</td>'+
            '<td>'+field["appliedleave"]+'</td>'+
            '<td style="text-align:center;"><a href="javascript:void(0)" onclick="showModalLeave(\''+field["transcode"]+'\')" class="btn btn-sm btn-primary" ><i class="fa fa-bars"></i></a></td>'+    
            '</tr>');
            
        })
    })

    $("#modalLeave").modal('toggle');
}